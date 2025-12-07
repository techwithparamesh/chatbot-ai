import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, signupSchema, loginSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

// Simple session store (in production, use Redis or database)
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

// Auth middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const session = sessions.get(sessionId);
  if (!session || session.expiresAt < new Date()) {
    sessions.delete(sessionId || "");
    return res.status(401).json({ error: "Session expired" });
  }
  
  (req as any).userId = session.userId;
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ AUTH ROUTES ============
  
  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parsed.error.flatten() 
        });
      }
      
      const existingUser = await storage.getUserByEmail(parsed.data.email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }
      
      // In production, hash the password!
      const user = await storage.createUser({
        email: parsed.data.email,
        password: parsed.data.password, // Should be hashed
        name: parsed.data.name,
      });
      
      // Create session
      const sessionId = randomUUID();
      sessions.set(sessionId, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      return res.status(201).json({ 
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionId 
      });
    } catch (error) {
      console.error("Error signing up:", error);
      return res.status(500).json({ error: "Failed to create account" });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parsed.error.flatten() 
        });
      }
      
      const user = await storage.getUserByEmail(parsed.data.email);
      if (!user || user.password !== parsed.data.password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Create session
      const sessionId = randomUUID();
      sessions.set(sessionId, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      return res.json({ 
        user: { id: user.id, email: user.email, name: user.name },
        token: sessionId 
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      sessions.delete(sessionId);
    }
    return res.json({ success: true });
  });
  
  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  
  // ============ WEBSITE ROUTES ============
  
  // Create website for scanning
  app.post("/api/websites", authMiddleware, async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }
      
      // Check if website already exists for this user
      let website = await storage.getWebsiteByUserAndUrl((req as any).userId, url);
      
      if (!website) {
        // Create new website if not exists
        website = await storage.createWebsite({
          userId: (req as any).userId,
          url,
        });
      }
      
      // Update status to scanning
      await storage.updateWebsite(website.id, { status: "scanning" });
      
      // Helper function to get base URL and check if URL is internal
      const getBaseUrl = (urlString: string): string => {
        try {
          const parsedUrl = new URL(urlString);
          return `${parsedUrl.protocol}//${parsedUrl.host}`;
        } catch {
          return urlString;
        }
      };
      
      const baseUrl = getBaseUrl(url);
      
      const isInternalLink = (link: string, base: string): boolean => {
        try {
          if (!link || link.startsWith('#') || link.startsWith('javascript:') || link.startsWith('mailto:') || link.startsWith('tel:')) {
            return false;
          }
          const absoluteUrl = new URL(link, base);
          const baseHost = new URL(base).host;
          return absoluteUrl.host === baseHost;
        } catch {
          return false;
        }
      };
      
      const normalizeUrl = (link: string, base: string): string => {
        try {
          const absoluteUrl = new URL(link, base);
          // Remove hash and trailing slash for consistency
          absoluteUrl.hash = '';
          let normalized = absoluteUrl.href;
          if (normalized.endsWith('/') && normalized !== base + '/') {
            normalized = normalized.slice(0, -1);
          }
          return normalized;
        } catch {
          return link;
        }
      };
      
      // Function to extract links from HTML
      const extractLinks = ($: any, currentUrl: string): string[] => {
        const links: string[] = [];
        $('a[href]').each((i: number, el: any) => {
          const href = $(el).attr('href');
          if (href && isInternalLink(href, baseUrl)) {
            const normalizedLink = normalizeUrl(href, currentUrl);
            if (!links.includes(normalizedLink)) {
              links.push(normalizedLink);
            }
          }
        });
        return links;
      };
      
      // Function to extract content from a page
      const extractPageContent = ($: any): { contentParts: string[], links: string[] } => {
        const contentParts: string[] = [];
        
        // Remove unwanted elements
        $('script, style, noscript, iframe, svg, canvas').remove();
        
        // Meta descriptions
        const metaDesc = $('meta[name="description"]').attr('content') || '';
        const ogDesc = $('meta[property="og:description"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        
        if (metaDesc) contentParts.push(metaDesc);
        if (ogDesc && ogDesc !== metaDesc) contentParts.push(ogDesc);
        if (ogTitle) contentParts.push(ogTitle);
        if (keywords) contentParts.push(keywords);
        
        // All headings (h1-h6)
        $('h1, h2, h3, h4, h5, h6').each((i: number, el: any) => {
          const text = $(el).text().trim();
          if (text && text.length > 2) contentParts.push(text);
        });
        
        // All paragraphs
        $('p').each((i: number, el: any) => {
          const text = $(el).text().trim();
          if (text && text.length > 10) contentParts.push(text);
        });
        
        // List items
        $('li').each((i: number, el: any) => {
          const text = $(el).text().trim();
          if (text && text.length > 10) contentParts.push(text);
        });
        
        // Divs and spans with meaningful text
        $('div, span, section, article, aside, main').each((i: number, el: any) => {
          const directText = $(el).contents().filter(function() {
            return this.type === 'text';
          }).text().trim();
          if (directText && directText.length > 15) contentParts.push(directText);
        });
        
        // Alt text, title attributes, aria-labels
        $('[alt], [title], [aria-label]').each((i: number, el: any) => {
          const alt = $(el).attr('alt');
          const titleAttr = $(el).attr('title');
          const ariaLabel = $(el).attr('aria-label');
          if (alt && alt.length > 3) contentParts.push(alt);
          if (titleAttr && titleAttr.length > 3) contentParts.push(titleAttr);
          if (ariaLabel && ariaLabel.length > 3) contentParts.push(ariaLabel);
        });
        
        // JSON-LD structured data
        $('script[type="application/ld+json"]').each((i: number, el: any) => {
          try {
            const jsonData = JSON.parse($(el).html() || '{}');
            const extractStrings = (obj: any, depth = 0): string[] => {
              if (depth > 5) return [];
              const strings: string[] = [];
              if (typeof obj === 'string' && obj.length > 10) {
                strings.push(obj);
              } else if (Array.isArray(obj)) {
                obj.forEach(item => strings.push(...extractStrings(item, depth + 1)));
              } else if (typeof obj === 'object' && obj !== null) {
                Object.values(obj).forEach(val => strings.push(...extractStrings(val, depth + 1)));
              }
              return strings;
            };
            contentParts.push(...extractStrings(jsonData));
          } catch (e) {
            // Ignore JSON parse errors
          }
        });
        
        // Fallback: get all body text
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        if (bodyText && contentParts.length < 5) {
          contentParts.push(bodyText);
        }
        
        // Get links before removing elements
        const links = extractLinks($, baseUrl);
        
        return { contentParts, links };
      };
      
      // Function to scrape a single page
      const scrapePage = async (pageUrl: string): Promise<{ title: string, content: string, links: string[] } | null> => {
        try {
          console.log(`Scraping page: ${pageUrl}`);
          const response = await axios.get(pageUrl, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
            }
          });
          
          const $ = cheerio.load(response.data);
          const title = $('title').text() || $('h1').first().text() || 'Untitled Page';
          
          // Extract links before modifying DOM
          const links = extractLinks($, pageUrl);
          
          const { contentParts } = extractPageContent($);
          const uniqueParts = [...new Set(contentParts.filter(p => p.length > 0))];
          const content = uniqueParts.join(' ').replace(/\s+/g, ' ').trim();
          
          console.log(`  - Title: ${title}`);
          console.log(`  - Content length: ${content.length} chars`);
          console.log(`  - Found ${links.length} internal links`);
          
          return { title, content, links };
        } catch (error: any) {
          console.error(`Failed to scrape ${pageUrl}:`, error.message);
          return null;
        }
      };
      
      // Perform the actual multi-page scraping
      try {
        console.log('Starting multi-page website scan for:', url);
        console.log('Base URL:', baseUrl);
        
        const scannedUrls = new Set<string>();
        const urlsToScan: string[] = [url];
        const allPageData: Array<{ url: string, title: string, content: string }> = [];
        const maxPages = 20; // Limit to prevent infinite crawling
        
        // Try Puppeteer first for the initial page (to discover SPA links)
        let puppeteerLinks: string[] = [];
        try {
          console.log('Attempting Puppeteer for initial page discovery...');
          const browser = await puppeteer.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--no-first-run',
              '--no-zygote',
              '--single-process'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
          });
          
          const page = await browser.newPage();
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const pageTitle = await page.title() || 'Home';
          
          // Get all internal links from the rendered page
          puppeteerLinks = await page.evaluate((baseUrlStr: string) => {
            const links: string[] = [];
            document.querySelectorAll('a[href]').forEach(a => {
              const href = a.getAttribute('href');
              if (href) {
                try {
                  const absoluteUrl = new URL(href, window.location.href);
                  const baseHost = new URL(baseUrlStr).host;
                  if (absoluteUrl.host === baseHost && 
                      !href.startsWith('#') && 
                      !href.startsWith('javascript:') &&
                      !href.startsWith('mailto:') &&
                      !href.startsWith('tel:')) {
                    absoluteUrl.hash = '';
                    links.push(absoluteUrl.href);
                  }
                } catch {}
              }
            });
            return [...new Set(links)];
          }, baseUrl);
          
          // Get content from the initial page
          const content = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(el => el.remove());
            const body = document.body;
            if (!body) return '';
            return body.innerText || body.textContent || '';
          });
          
          const cleanContent = content.replace(/\s+/g, ' ').trim();
          
          if (cleanContent.length > 0) {
            allPageData.push({ url, title: pageTitle, content: cleanContent });
            scannedUrls.add(url);
            console.log(`Puppeteer scraped home page: ${cleanContent.length} chars`);
          }
          
          await browser.close();
          
          // Add discovered links to scan queue
          for (const link of puppeteerLinks) {
            if (!urlsToScan.includes(link) && !scannedUrls.has(link)) {
              urlsToScan.push(link);
            }
          }
          
          console.log(`Puppeteer discovered ${puppeteerLinks.length} internal links`);
          
        } catch (puppeteerError: any) {
          console.log('Puppeteer failed:', puppeteerError.message);
          console.log('Will use axios for all pages...');
        }
        
        // Scan all discovered pages using axios
        while (urlsToScan.length > 0 && scannedUrls.size < maxPages) {
          const currentUrl = urlsToScan.shift()!;
          
          if (scannedUrls.has(currentUrl)) {
            continue;
          }
          
          scannedUrls.add(currentUrl);
          
          const result = await scrapePage(currentUrl);
          
          if (result && result.content.length > 50) {
            allPageData.push({
              url: currentUrl,
              title: result.title,
              content: result.content
            });
            
            // Add new links to queue
            for (const link of result.links) {
              if (!scannedUrls.has(link) && !urlsToScan.includes(link)) {
                urlsToScan.push(link);
              }
            }
          }
          
          // Small delay to be respectful
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log(`\n=== Scan Complete ===`);
        console.log(`Total pages scanned: ${allPageData.length}`);
        allPageData.forEach(p => console.log(`  - ${p.title}: ${p.content.length} chars`));
        
        if (allPageData.length > 0) {
          await storage.updateWebsite(website.id, {
            status: "completed",
            pagesScanned: allPageData.map(p => p.url),
            content: allPageData,
          });
          console.log('Website scan completed successfully with', allPageData.length, 'pages');
        } else {
          console.log('Failed to scrape any content');
          await storage.updateWebsite(website.id, { status: "failed" });
        }
        
      } catch (err: any) {
        console.error('Scraping error:', err.message);
        await storage.updateWebsite(website.id, { status: "failed" });
      }
      
      // Return the updated website
      const updatedWebsite = await storage.getWebsite(website.id);
      return res.status(201).json(updatedWebsite);
    } catch (error) {
      console.error("Error creating website:", error);
      return res.status(500).json({ error: "Failed to create website" });
    }
  });
  
  // Get user's websites
  app.get("/api/websites", authMiddleware, async (req, res) => {
    try {
      const websites = await storage.getWebsitesByUser((req as any).userId);
      return res.json(websites);
    } catch (error) {
      console.error("Error fetching websites:", error);
      return res.status(500).json({ error: "Failed to fetch websites" });
    }
  });
  
  // Get single website
  app.get("/api/websites/:id", authMiddleware, async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website || website.userId !== (req as any).userId) {
        return res.status(404).json({ error: "Website not found" });
      }
      return res.json(website);
    } catch (error) {
      console.error("Error fetching website:", error);
      return res.status(500).json({ error: "Failed to fetch website" });
    }
  });
  
  // ============ CHATBOT ROUTES ============
  
  // Create chatbot
  app.post("/api/chatbots", authMiddleware, async (req, res) => {
    try {
      const { name, websiteId, greetingType, greetingMessages } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "Bot name is required" });
      }
      
      // Get knowledge base from website if provided
      let knowledgeBase: any[] = [];
      if (websiteId) {
        const website = await storage.getWebsite(websiteId);
        console.log('Website found:', !!website);
        console.log('Website content:', website?.content?.length || 0);
        if (website && website.content && website.content.length > 0) {
          knowledgeBase = website.content;
          console.log('Knowledge base loaded:', knowledgeBase.length, 'pages');
        }
      }
      
      const chatbot = await storage.createChatbot({
        userId: (req as any).userId,
        websiteId: websiteId || null,
        name,
        greetingType: greetingType || "custom",
        greetingMessages: greetingMessages || ["Hello! How can I help you today?"],
        knowledgeBase: knowledgeBase,
      });
      
      console.log('Chatbot created with KB length:', chatbot.knowledgeBase?.length || 0);
      
      return res.status(201).json(chatbot);
    } catch (error) {
      console.error("Error creating chatbot:", error);
      return res.status(500).json({ error: "Failed to create chatbot" });
    }
  });
  
  // Get user's chatbots
  app.get("/api/chatbots", authMiddleware, async (req, res) => {
    try {
      const chatbots = await storage.getChatbotsByUser((req as any).userId);
      return res.json(chatbots);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      return res.status(500).json({ error: "Failed to fetch chatbots" });
    }
  });
  
  // Get single chatbot
  app.get("/api/chatbots/:id", authMiddleware, async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot || chatbot.userId !== (req as any).userId) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      return res.json(chatbot);
    } catch (error) {
      console.error("Error fetching chatbot:", error);
      return res.status(500).json({ error: "Failed to fetch chatbot" });
    }
  });
  
  // Update chatbot
  app.patch("/api/chatbots/:id", authMiddleware, async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot || chatbot.userId !== (req as any).userId) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      
      const updated = await storage.updateChatbot(req.params.id, req.body);
      return res.json(updated);
    } catch (error) {
      console.error("Error updating chatbot:", error);
      return res.status(500).json({ error: "Failed to update chatbot" });
    }
  });
  
  // Upload knowledge base to chatbot
  app.post("/api/chatbots/:id/knowledge", authMiddleware, async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot || chatbot.userId !== (req as any).userId) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      
      const { websiteId } = req.body;
      if (websiteId) {
        const website = await storage.getWebsite(websiteId);
        if (website && website.content) {
          await storage.updateChatbot(req.params.id, {
            knowledgeBase: website.content,
            websiteId,
          });
        }
      }
      
      const updated = await storage.getChatbot(req.params.id);
      return res.json(updated);
    } catch (error) {
      console.error("Error uploading knowledge:", error);
      return res.status(500).json({ error: "Failed to upload knowledge" });
    }
  });
  
  // Delete chatbot
  app.delete("/api/chatbots/:id", authMiddleware, async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot || chatbot.userId !== (req as any).userId) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      
      await storage.deleteChatbot(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chatbot:", error);
      return res.status(500).json({ error: "Failed to delete chatbot" });
    }
  });
  
  // ============ CHAT ROUTES (Public for testing) ============
  
  // Get chatbot for testing (public)
  app.get("/api/chat/:id/info", async (req, res) => {
    try {
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      return res.json({
        id: chatbot.id,
        name: chatbot.name,
        greetingMessages: chatbot.greetingMessages,
      });
    } catch (error) {
      console.error("Error fetching chatbot:", error);
      return res.status(500).json({ error: "Failed to fetch chatbot" });
    }
  });
  
  // Send message to chatbot
  app.post("/api/chat/:id/message", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      const chatbot = await storage.getChatbot(req.params.id);
      if (!chatbot) {
        return res.status(404).json({ error: "Chatbot not found" });
      }
      
      // Debug logging
      console.log('=== CHATBOT MESSAGE DEBUG ===');
      console.log('Chatbot ID:', chatbot.id);
      console.log('Chatbot Name:', chatbot.name);
      console.log('User Message:', message);
      console.log('Knowledge Base exists:', !!chatbot.knowledgeBase);
      console.log('Knowledge Base length:', chatbot.knowledgeBase?.length || 0);
      if (chatbot.knowledgeBase && chatbot.knowledgeBase.length > 0) {
        console.log('First KB entry title:', chatbot.knowledgeBase[0].title);
        console.log('First KB entry content length:', chatbot.knowledgeBase[0].content?.length || 0);
      }
      console.log('============================');
      
      await storage.createChatMessage({
        chatbotId: chatbot.id,
        sessionId,
        role: "user",
        content: message,
      });
      let response = "I'm sorry, I don't have information about that in my knowledge base. Please try asking something else or rephrase your question.";
      
      // Check for greetings
      const greetings = ["hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening"];
      if (greetings.some(g => message.toLowerCase().includes(g))) {
        response = chatbot.greetingMessages?.[0] || "Hello! How can I help you today?";
      } else if (chatbot.knowledgeBase && chatbot.knowledgeBase.length > 0) {
        // Find the most relevant content from the knowledge base
        const lowerMessage = message.toLowerCase();
        // Extract meaningful words (length > 2) and create stems for better matching
        const queryWords = lowerMessage.split(/\s+/).filter(w => w.length > 2);
        
        // Simple stemming function - removes common endings
        const stem = (word: string): string => {
          return word
            .replace(/ing$/, '')
            .replace(/tion$/, '')
            .replace(/ment$/, '')
            .replace(/ness$/, '')
            .replace(/able$/, '')
            .replace(/ible$/, '')
            .replace(/ful$/, '')
            .replace(/less$/, '')
            .replace(/ous$/, '')
            .replace(/ive$/, '')
            .replace(/ly$/, '')
            .replace(/es$/, '')
            .replace(/ed$/, '')
            .replace(/s$/, '');
        };
        
        // Create stems for query words
        const queryStems = queryWords.map(w => stem(w));
        
        console.log('Query words:', queryWords);
        console.log('Query stems:', queryStems);
        console.log('Total pages in knowledge base:', chatbot.knowledgeBase.length);
        
        // Store all matches with scores
        const allMatches: Array<{ page: any, score: number, context: string }> = [];
        
        for (const page of chatbot.knowledgeBase) {
          const pageText = `${page.title} ${page.content}`.toLowerCase();
          const pageWords = pageText.split(/\s+/);
          let score = 0;
          
          // Score by matching words - use includes() for partial matching
          for (const word of queryWords) {
            // Method 1: Direct includes check (partial match)
            if (pageText.includes(word)) {
              score += 2; // Higher score for exact match
            }
            
            // Method 2: Check if any page word starts with the query word
            for (const pageWord of pageWords) {
              if (pageWord.startsWith(word) || word.startsWith(pageWord)) {
                score += 1;
              }
            }
          }
          
          // Method 3: Stem matching for better recall
          for (const queryStem of queryStems) {
            if (queryStem.length >= 3 && pageText.includes(queryStem)) {
              score += 1.5;
            }
          }
          
          console.log(`Page "${page.title}" (${page.url}) score: ${score}`);
          
          if (score > 0) {
            // Extract relevant context (find sentences containing query words or their stems)
            const sentences = page.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
            let relevantSentences: string[] = [];
            
            for (const sentence of sentences) {
              const lowerSentence = sentence.toLowerCase();
              // Check for query words or stems in the sentence
              const hasMatch = queryWords.some(word => lowerSentence.includes(word)) ||
                              queryStems.some(stem => stem.length >= 3 && lowerSentence.includes(stem));
              if (hasMatch) {
                relevantSentences.push(sentence.trim());
                if (relevantSentences.length >= 3) break; // Limit to 3 sentences per page
              }
            }
            
            const context = relevantSentences.length > 0 
              ? relevantSentences.join('. ') + '.'
              : page.content.substring(0, 300) + (page.content.length > 300 ? '...' : '');
            
            allMatches.push({ page, score, context });
          }
        }
        
        // Sort by score descending
        allMatches.sort((a, b) => b.score - a.score);
        
        console.log(`Found ${allMatches.length} matching pages`);
        
        if (allMatches.length > 0) {
          // Take top 3 matches for comprehensive response
          const topMatches = allMatches.slice(0, 3);
          
          if (topMatches.length === 1) {
            response = `Based on information from **${topMatches[0].page.title}**:\n\n${topMatches[0].context}`;
          } else {
            // Multiple relevant pages found
            let combinedResponse = `I found relevant information from ${topMatches.length} pages:\n\n`;
            topMatches.forEach((match, index) => {
              combinedResponse += `**${match.page.title}:**\n${match.context}\n\n`;
            });
            response = combinedResponse.trim();
          }
        }
      }
      const botMessage = await storage.createChatMessage({
        chatbotId: chatbot.id,
        sessionId,
        role: "assistant",
        content: response,
      });
      return res.json({ response, messageId: botMessage.id });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Failed to process message" });
    }
  });
  
  // Get chat history
  app.get("/api/chat/:id/history/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.id, req.params.sessionId);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // ============ LEADS ROUTES ============
  
  app.post("/api/leads", async (req, res) => {
    try {
      const parsed = insertLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parsed.error.flatten() 
        });
      }
      
      const lead = await storage.createLead(parsed.data);
      return res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.get("/api/leads", async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      return res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  return httpServer;
}

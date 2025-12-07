import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, signupSchema, loginSchema } from "@shared/schema";
import { randomUUID } from "crypto";

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
  const axios = require('axios');
  const cheerio = require('cheerio');
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
      
      await storage.updateWebsite(website.id, { status: "scanning" });
      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        // Get all visible text from the body
        let content = $('body').text();
        content = content.replace(/\s+/g, ' ').trim();
        const pageData = [{ url, title, content }];
        await storage.updateWebsite(website.id, {
          status: "completed",
          pagesScanned: [url],
          content: pageData,
        });
      } catch (err) {
        await storage.updateWebsite(website.id, { status: "failed" });
      }
      return res.status(201).json(await storage.getWebsite(website.id));
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
      
      const chatbot = await storage.createChatbot({
        userId: (req as any).userId,
        websiteId: websiteId || null,
        name,
        greetingType: greetingType || "custom",
        greetingMessages: greetingMessages || ["Hello! How can I help you today?"],
      });
      
      // If websiteId is provided, automatically load knowledge base
      if (websiteId) {
        const website = await storage.getWebsite(websiteId);
        if (website && website.content && website.content.length > 0) {
          await storage.updateChatbot(chatbot.id, {
            knowledgeBase: website.content,
          });
        }
      }
      
      const updatedChatbot = await storage.getChatbot(chatbot.id);
      return res.status(201).json(updatedChatbot);
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
      await storage.createChatMessage({
        chatbotId: chatbot.id,
        sessionId,
        role: "user",
        content: message,
      });
      let response = "I'm sorry, I couldn't find an exact answer to your question.";
      // Check for greetings
      const greetings = ["hi", "hello", "hey", "hola", "greetings"];
      if (greetings.some(g => message.toLowerCase().includes(g))) {
        response = chatbot.greetingMessages?.[0] || "Hello! How can I help you today?";
      } else if (chatbot.knowledgeBase && chatbot.knowledgeBase.length > 0) {
        // Find the most relevant content from the knowledge base
        const lowerMessage = message.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;
        for (const page of chatbot.knowledgeBase) {
          // Score by number of matching words
          const pageText = `${page.title} ${page.content}`.toLowerCase();
          const words = lowerMessage.split(/\s+/);
          let score = 0;
          for (const word of words) {
            if (pageText.includes(word)) score++;
          }
          if (score > bestScore) {
            bestScore = score;
            bestMatch = page;
          }
        }
        if (bestMatch && bestScore > 0) {
          response = `From ${bestMatch.title}: ${bestMatch.content}`;
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

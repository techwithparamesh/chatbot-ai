import { 
  type User, type InsertUser, 
  type Lead, type InsertLead,
  type Website, type InsertWebsite,
  type Chatbot, type InsertChatbot,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  
  // Website methods
  createWebsite(website: InsertWebsite): Promise<Website>;
  getWebsite(id: string): Promise<Website | undefined>;
  getWebsitesByUser(userId: string): Promise<Website[]>;
  getWebsiteByUserAndUrl(userId: string, url: string): Promise<Website | undefined>;
  updateWebsite(id: string, data: Partial<Website>): Promise<Website | undefined>;
  
  // Chatbot methods
  createChatbot(chatbot: InsertChatbot): Promise<Chatbot>;
  getChatbot(id: string): Promise<Chatbot | undefined>;
  getChatbotsByUser(userId: string): Promise<Chatbot[]>;
  updateChatbot(id: string, data: Partial<Chatbot>): Promise<Chatbot | undefined>;
  deleteChatbot(id: string): Promise<boolean>;
  
  // Chat message methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(chatbotId: string, sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private websites: Map<string, Website>;
  private chatbots: Map<string, Chatbot>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.websites = new Map();
    this.chatbots = new Map();
    this.chatMessages = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { ...insertLead, id };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  // Website methods
  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const id = randomUUID();
    const website: Website = {
      ...insertWebsite,
      id,
      status: "pending",
      pagesScanned: [],
      content: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.websites.set(id, website);
    return website;
  }

  async getWebsite(id: string): Promise<Website | undefined> {
    return this.websites.get(id);
  }

  async getWebsitesByUser(userId: string): Promise<Website[]> {
    return Array.from(this.websites.values()).filter(
      (website) => website.userId === userId
    );
  }

  async getWebsiteByUserAndUrl(userId: string, url: string): Promise<Website | undefined> {
    return Array.from(this.websites.values()).find(
      (website) => website.userId === userId && website.url === url
    );
  }

  async updateWebsite(id: string, data: Partial<Website>): Promise<Website | undefined> {
    const website = this.websites.get(id);
    if (!website) return undefined;
    
    const updated = { ...website, ...data, updatedAt: new Date() };
    this.websites.set(id, updated);
    return updated;
  }

  // Chatbot methods
  async createChatbot(insertChatbot: InsertChatbot): Promise<Chatbot> {
    const id = randomUUID();
    const testUrl = `/chat/test/${id}`;
    const embedCode = `<script src="${process.env.BASE_URL || 'http://localhost:5008'}/embed/${id}.js"></script>`;
    
    const chatbot: Chatbot = {
      ...insertChatbot,
      id,
      isActive: false,
      testUrl,
      embedCode,
      knowledgeBase: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatbots.set(id, chatbot);
    return chatbot;
  }

  async getChatbot(id: string): Promise<Chatbot | undefined> {
    return this.chatbots.get(id);
  }

  async getChatbotsByUser(userId: string): Promise<Chatbot[]> {
    return Array.from(this.chatbots.values()).filter(
      (chatbot) => chatbot.userId === userId
    );
  }

  async updateChatbot(id: string, data: Partial<Chatbot>): Promise<Chatbot | undefined> {
    const chatbot = this.chatbots.get(id);
    if (!chatbot) return undefined;
    
    const updated = { ...chatbot, ...data, updatedAt: new Date() };
    this.chatbots.set(id, updated);
    return updated;
  }

  async deleteChatbot(id: string): Promise<boolean> {
    return this.chatbots.delete(id);
  }

  // Chat message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessages(chatbotId: string, sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.chatbotId === chatbotId && msg.sessionId === sessionId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();

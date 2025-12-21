import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replit_integrations/auth";
import { insertProductSchema, insertTenderSchema, insertTipSchema, insertUserMissionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const validated = insertProductSchema.parse({
        ...req.body,
        userId: userId,
      });
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Failed to create product", error: String(error) });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/user/:id/products", async (req, res) => {
    try {
      const products = await storage.getProductsByUser(req.params.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching user products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Tenders endpoints
  app.get("/api/tenders", async (req, res) => {
    try {
      const tenders = await storage.getTenders();
      res.json(tenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      res.status(500).json({ message: "Failed to fetch tenders" });
    }
  });

  app.post("/api/tenders", isAuthenticated, async (req: any, res) => {
    try {
      const validated = insertTenderSchema.parse(req.body);
      const tender = await storage.createTender(validated);
      res.status(201).json(tender);
    } catch (error) {
      console.error("Error creating tender:", error);
      res.status(400).json({ message: "Failed to create tender" });
    }
  });

  app.get("/api/tenders/:id", async (req, res) => {
    try {
      const tender = await storage.getTender(req.params.id);
      if (!tender) return res.status(404).json({ message: "Tender not found" });
      res.json(tender);
    } catch (error) {
      console.error("Error fetching tender:", error);
      res.status(500).json({ message: "Failed to fetch tender" });
    }
  });

  // Missions endpoints
  app.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getMissions();
      res.json(missions);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get("/api/user/:id/missions", isAuthenticated, async (req: any, res) => {
    try {
      const userMissions = await storage.getUserMissions(req.params.id);
      res.json(userMissions);
    } catch (error) {
      console.error("Error fetching user missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.post("/api/user-missions", isAuthenticated, async (req: any, res) => {
    try {
      const validated = insertUserMissionSchema.parse(req.body);
      const userMission = await storage.createUserMission(validated);
      res.status(201).json(userMission);
    } catch (error) {
      console.error("Error creating user mission:", error);
      res.status(400).json({ message: "Failed to create user mission" });
    }
  });

  app.patch("/api/user-missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { progress, status } = req.body;
      await storage.updateUserMissionProgress(req.params.id, progress, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user mission:", error);
      res.status(400).json({ message: "Failed to update user mission" });
    }
  });

  // Tips/Community endpoints
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.post("/api/tips", isAuthenticated, async (req: any, res) => {
    try {
      const validated = insertTipSchema.parse(req.body);
      const tip = await storage.createTip(validated);
      res.status(201).json(tip);
    } catch (error) {
      console.error("Error creating tip:", error);
      res.status(400).json({ message: "Failed to create tip" });
    }
  });

  // Supply Network endpoints
  app.get("/api/user/:id/supply-network", async (req, res) => {
    try {
      const networks = await storage.getSupplyNetworksByUser(req.params.id);
      res.json(networks);
    } catch (error) {
      console.error("Error fetching supply network:", error);
      res.status(500).json({ message: "Failed to fetch supply network" });
    }
  });

  app.post("/api/supply-network", isAuthenticated, async (req: any, res) => {
    try {
      const network = await storage.createSupplyNetwork(req.body);
      res.status(201).json(network);
    } catch (error) {
      console.error("Error creating supply network:", error);
      res.status(400).json({ message: "Failed to create supply network" });
    }
  });

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDeckSchema, insertCardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Deck routes
  app.get("/api/decks", async (_req, res) => {
    const decks = await storage.getAllDecks();
    res.json(decks);
  });

  app.get("/api/decks/:id", async (req, res) => {
    const deck = await storage.getDeck(Number(req.params.id));
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.json(deck);
  });

  app.post("/api/decks", async (req, res) => {
    const result = insertDeckSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid deck data" });
    }
    const deck = await storage.createDeck(result.data);
    res.json(deck);
  });

  app.delete("/api/decks/:id", async (req, res) => {
    await storage.deleteDeck(Number(req.params.id));
    res.status(204).end();
  });

  // Card routes
  app.get("/api/decks/:id/cards", async (req, res) => {
    const cards = await storage.getCardsByDeck(Number(req.params.id));
    res.json(cards);
  });

  app.post("/api/cards", async (req, res) => {
    const result = insertCardSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid card data" });
    }
    const card = await storage.createCard(result.data);
    res.json(card);
  });

  app.delete("/api/cards/:id", async (req, res) => {
    await storage.deleteCard(Number(req.params.id));
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}

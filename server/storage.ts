import { type Deck, type Card, type InsertDeck, type InsertCard } from "@shared/schema";

export interface IStorage {
  // Deck operations
  getDeck(id: number): Promise<Deck | undefined>;
  getAllDecks(): Promise<Deck[]>;
  createDeck(deck: InsertDeck): Promise<Deck>;
  deleteDeck(id: number): Promise<void>;
  
  // Card operations
  getCard(id: number): Promise<Card | undefined>;
  getCardsByDeck(deckId: number): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private decks: Map<number, Deck>;
  private cards: Map<number, Card>;
  private deckId: number;
  private cardId: number;

  constructor() {
    this.decks = new Map();
    this.cards = new Map();
    this.deckId = 1;
    this.cardId = 1;
  }

  async getDeck(id: number): Promise<Deck | undefined> {
    return this.decks.get(id);
  }

  async getAllDecks(): Promise<Deck[]> {
    return Array.from(this.decks.values());
  }

  async createDeck(deck: InsertDeck): Promise<Deck> {
    const id = this.deckId++;
    const newDeck: Deck = { ...deck, id };
    this.decks.set(id, newDeck);
    return newDeck;
  }

  async deleteDeck(id: number): Promise<void> {
    this.decks.delete(id);
    // Delete associated cards
    const cards = Array.from(this.cards.values());
    cards.forEach(card => {
      if (card.deckId === id) {
        this.cards.delete(card.id);
      }
    });
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async getCardsByDeck(deckId: number): Promise<Card[]> {
    return Array.from(this.cards.values()).filter(card => card.deckId === deckId);
  }

  async createCard(card: InsertCard): Promise<Card> {
    const id = this.cardId++;
    const newCard: Card = { ...card, id };
    this.cards.set(id, newCard);
    return newCard;
  }

  async deleteCard(id: number): Promise<void> {
    this.cards.delete(id);
  }
}

export const storage = new MemStorage();

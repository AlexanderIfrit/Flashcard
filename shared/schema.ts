import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  tags: text("tags").array(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  frontImage: text("front_image"),
  backImage: text("back_image"),
  notes: text("notes"),
  tags: text("tags").array(),
});

export const insertDeckSchema = createInsertSchema(decks).pick({
  name: true,
  description: true,
  tags: true,
});

export const insertCardSchema = createInsertSchema(cards).pick({
  deckId: true,
  front: true,
  back: true,
  frontImage: true,
  backImage: true,
  notes: true,
  tags: true,
});

export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Deck = typeof decks.$inferSelect;
export type Card = typeof cards.$inferSelect;
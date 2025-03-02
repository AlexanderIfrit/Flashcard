import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Card, type Deck } from "@shared/schema";
import Flashcard from "@/components/flashcard";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Study() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: deck } = useQuery<Deck>({
    queryKey: [`/api/decks/${id}`],
  });

  const { data: cards, isLoading } = useQuery<Card[]>({
    queryKey: [`/api/decks/${id}/cards`],
  });

  if (isLoading || !cards || !deck) {
    return (
      <div className="h-[300px] bg-muted rounded-lg animate-pulse" />
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{deck.name}</h1>
        <div className="text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {currentCard && (
        <Flashcard
          card={currentCard}
          showControls
          onPrev={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : undefined}
          onNext={currentIndex < cards.length - 1 ? () => setCurrentIndex(i => i + 1) : undefined}
        />
      )}
    </motion.div>
  );
}

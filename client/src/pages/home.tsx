import { useQuery } from "@tanstack/react-query";
import DeckCard from "@/components/deck-card";
import { type Deck } from "@shared/schema";
import { motion } from "framer-motion";

export default function Home() {
  const { data: decks, isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold">Vos Decks de Flashcards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks?.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </motion.div>
  );
}
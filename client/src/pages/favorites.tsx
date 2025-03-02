import { useQuery } from "@tanstack/react-query";
import { type Deck } from "@shared/schema";
import DeckCard from "@/components/deck-card";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Favorites() {
  const { data: decks, isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  const favoriteDecks = decks?.filter((deck) => 
    // TODO: Implémenter la logique des favoris
    deck.tags?.includes("favori")
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!favoriteDecks?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4 mt-12"
      >
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Aucun deck favori</h2>
        <p className="text-muted-foreground">
          Ajoutez des decks à vos favoris pour les retrouver ici rapidement.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Vos Decks Favoris</h1>
        <div className="text-muted-foreground">
          {favoriteDecks.length} deck{favoriteDecks.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteDecks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </motion.div>
  );
}

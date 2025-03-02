import { useQuery } from "@tanstack/react-query";
import { type Deck } from "@shared/schema";
import DeckCard from "@/components/deck-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Tags as TagsIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const tagColors: { [key: string]: string } = {
  important: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  nouveau: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  révision: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  facile: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
};

export default function Tags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: decks = [], isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  // Extraire tous les tags uniques de tous les decks
  const allTags = Array.from(
    new Set(decks.flatMap((deck) => deck.tags || []))
  ).sort();

  // Filtrer les decks en fonction des tags sélectionnés et du terme de recherche
  const filteredDecks = decks.filter((deck) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => deck.tags?.includes(tag));
    
    const matchesSearch =
      searchTerm === "" ||
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTags && matchesSearch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-64 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-muted rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Gestion des Tags</h1>
        <div className="text-muted-foreground">
          {allTags.length} tag{allTags.length > 1 ? "s" : ""}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrer par Tags</CardTitle>
          <CardDescription>
            Sélectionnez un ou plusieurs tags pour filtrer vos decks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des tags ou des decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-24">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {allTags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-2",
                        selectedTags.includes(tag) && "ring-2 ring-primary",
                        tagColors[tag.toLowerCase()]
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      <TagsIcon className="h-3 w-3" />
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDecks.map((deck) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DeckCard deck={deck} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDecks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4 mt-12"
        >
          <TagsIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Aucun deck trouvé</h2>
          <p className="text-muted-foreground">
            Aucun deck ne correspond à votre recherche ou aux tags sélectionnés.
          </p>
          {selectedTags.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedTags([])}
            >
              Réinitialiser les filtres
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

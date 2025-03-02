import { useQuery } from "@tanstack/react-query";
import { type Deck } from "@shared/schema";
import DeckCard from "@/components/deck-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library as LibraryIcon, Search, SortAsc, Grid3X3, List } from "lucide-react";

type SortOption = "name" | "createdAt" | "lastStudied";
type ViewMode = "grid" | "list";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { data: decks = [], isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  // Filtrer et trier les decks
  const filteredAndSortedDecks = decks
    .filter((deck) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        deck.name.toLowerCase().includes(searchLower) ||
        deck.description?.toLowerCase().includes(searchLower) ||
        deck.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        // TODO: Implémenter d'autres options de tri
        default:
          return 0;
      }
    });

  const stats = {
    total: decks.length,
    recent: decks.filter((deck) => deck.tags?.includes("nouveau")).length,
    favorite: decks.filter((deck) => deck.tags?.includes("favori")).length,
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
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
        <h1 className="text-4xl font-bold">Bibliothèque</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LibraryIcon className="h-5 w-5" />
              Total des decks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decks récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.recent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decks favoris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.favorite}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recherche et filtres</CardTitle>
          <CardDescription>
            Trouvez rapidement les decks dont vous avez besoin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  <SelectValue placeholder="Trier par" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="createdAt">Date de création</SelectItem>
                <SelectItem value="lastStudied">Dernière révision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}
        >
          {filteredAndSortedDecks.map((deck) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DeckCard
                deck={deck}
                className={viewMode === "list" ? "!grid grid-cols-[1fr,auto]" : ""}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredAndSortedDecks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4 mt-12"
        >
          <LibraryIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Aucun deck trouvé</h2>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

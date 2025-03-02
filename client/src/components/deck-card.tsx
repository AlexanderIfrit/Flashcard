import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, ListChecks, Trash2 } from "lucide-react";
import { type Deck } from "@shared/schema";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DeckCardProps {
  deck: Deck;
}

export default function DeckCard({ deck }: DeckCardProps) {
  const { toast } = useToast();

  const deleteDeck = async () => {
    try {
      await apiRequest("DELETE", `/api/decks/${deck.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({
        title: "Deck deleted",
        description: "The deck has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete deck",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-xl font-bold">{deck.name}</h3>
          {deck.description && (
            <p className="text-muted-foreground">{deck.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {deck.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Link href={`/study/${deck.id}`}>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Study
              </Button>
            </Link>
            <Link href={`/quiz/${deck.id}`}>
              <Button variant="outline" size="sm">
                <ListChecks className="h-4 w-4 mr-2" />
                Quiz
              </Button>
            </Link>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteDeck}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Card, type Deck } from "@shared/schema";
import { useState } from "react";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

export default function Quiz() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

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
  const isLastCard = currentIndex === cards.length - 1;

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    if (isLastCard) {
      setShowAnswer(false);
      return;
    }
    setCurrentIndex(i => i + 1);
    setShowAnswer(false);
  };

  if (!currentCard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-xl">
          Your score: {score} out of {cards.length}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
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
        <h1 className="text-4xl font-bold">{deck.name} Quiz</h1>
        <div className="text-muted-foreground">
          Question {currentIndex + 1} of {cards.length}
        </div>
      </div>

      <CardUI className="min-h-[300px]">
        <CardContent className="flex items-center justify-center p-8 text-center text-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={showAnswer ? "answer" : "question"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {showAnswer ? currentCard.back : currentCard.front}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </CardUI>

      <div className="flex justify-center gap-4">
        {!showAnswer ? (
          <Button
            size="lg"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleAnswer(false)}
            >
              <X className="h-5 w-5 mr-2" />
              Incorrect
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleAnswer(true)}
            >
              <Check className="h-5 w-5 mr-2" />
              Correct
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

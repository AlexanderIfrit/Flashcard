import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rotate3D } from "lucide-react";
import { useState } from "react";
import type { Card as FlashCard } from "@shared/schema";

interface FlashcardProps {
  card: FlashCard;
  showControls?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Flashcard({ card, showControls, onNext, onPrev }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={isFlipped ? "back" : "front"}
          initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ perspective: 1000 }}
        >
          <Card className="min-h-[300px] flex flex-col">
            <CardContent className="flex-1 flex items-center justify-center p-8 text-center text-lg">
              {isFlipped ? card.back : card.front}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Rotate3D className="h-5 w-5 mr-2" />
          Flip
        </Button>

        {showControls && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrev}
              disabled={!onPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={!onNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

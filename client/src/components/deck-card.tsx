import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, ListChecks, Trash2, Star, Share2, Edit2, MoreVertical, Info } from "lucide-react";
import { type Deck } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DeckCardProps {
  deck: Deck;
  className?: string;
  showActions?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const tagColors: { [key: string]: string } = {
  important: "bg-red-500/10 text-red-500",
  nouveau: "bg-green-500/10 text-green-500",
  révision: "bg-blue-500/10 text-blue-500",
  facile: "bg-yellow-500/10 text-yellow-500",
};

export default function DeckCard({ deck, className, showActions = true }: DeckCardProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const deleteDeck = async () => {
    try {
      await apiRequest("DELETE", `/api/decks/${deck.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({
        title: "Deck supprimé",
        description: "Le deck a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le deck",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isFavorite
        ? "Le deck a été retiré de vos favoris"
        : "Le deck a été ajouté à vos favoris",
    });
  };

  const shareDeck = () => {
    navigator.clipboard.writeText(`${window.location.origin}/deck/${deck.id}`);
    toast({
      title: "Lien copié",
      description: "Le lien du deck a été copié dans le presse-papier",
    });
  };

  const cardActions = [
    {
      icon: Star,
      label: isFavorite ? "Retirer des favoris" : "Ajouter aux favoris",
      onClick: toggleFavorite,
      className: cn(isFavorite && "text-yellow-500"),
    },
    {
      icon: Share2,
      label: "Partager",
      onClick: shareDeck,
    },
    {
      icon: Edit2,
      label: "Modifier",
      href: `/edit/${deck.id}`,
    },
  ];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn("h-full overflow-hidden", className)}>
        <CardHeader className="relative space-y-3">
          <motion.div
            initial={false}
            animate={{ height: isHovered ? "auto" : "2.5rem" }}
            className="overflow-hidden"
          >
            <h3 className="text-xl font-bold leading-tight">{deck.name}</h3>
            {deck.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {deck.description}
              </p>
            )}
          </motion.div>

          {showActions && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", isFavorite && "text-yellow-500")}
                      onClick={toggleFavorite}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cardActions.map(({ icon: Icon, label, onClick, href, className }) => (
                    <DropdownMenuItem
                      key={label}
                      onClick={onClick}
                      className={cn("cursor-pointer", className)}
                    >
                      {href ? (
                        <Link href={href} className="flex items-center w-full">
                          <Icon className="mr-2 h-4 w-4" />
                          {label}
                        </Link>
                      ) : (
                        <>
                          <Icon className="mr-2 h-4 w-4" />
                          {label}
                        </>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-500 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Toutes les cartes de ce deck seront également supprimées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteDeck} className="bg-red-500">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            <motion.div className="flex flex-wrap gap-2">
              {deck.tags?.map((tag, index) => (
                <motion.div
                  key={tag}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className={cn(
                      "transition-colors",
                      tagColors[tag.toLowerCase()] || "bg-gray-500/10"
                    )}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            <span>15 cartes • Dernière révision il y a 2 jours</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Link href={`/study/${deck.id}`}>
              <Button variant="default" size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Étudier
              </Button>
            </Link>
            <Link href={`/quiz/${deck.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ListChecks className="h-4 w-4" />
                Quiz
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
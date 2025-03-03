import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { type Deck, type Card, type InsertCard, insertCardSchema } from "@shared/schema";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card as CardUI, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Plus, Edit2, Trash2, Save, ArrowLeft, Upload } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface CardFormInputs extends InsertCard {
  frontImage?: FileList;
  backImage?: FileList;
}

export default function EditDeck() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  const { data: deck, isLoading: isDeckLoading } = useQuery<Deck>({
    queryKey: [`/api/decks/${id}`],
  });

  const { data: cards = [], isLoading: areCardsLoading } = useQuery<Card[]>({
    queryKey: [`/api/decks/${id}/cards`],
  });

  const cardForm = useForm<CardFormInputs>({
    resolver: zodResolver(insertCardSchema),
    defaultValues: {
      deckId: Number(id),
      front: "",
      back: "",
      notes: "",
      tags: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontImagePreview(reader.result as string);
        } else {
          setBackImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitCard = async (data: CardFormInputs) => {
    try {
      const formData = new FormData();
      formData.append('deckId', String(data.deckId));
      formData.append('front', data.front);
      formData.append('back', data.back);
      if (data.notes) formData.append('notes', data.notes);
      if (data.tags?.length) formData.append('tags', JSON.stringify(data.tags));

      if (data.frontImage?.[0]) {
        formData.append('frontImage', data.frontImage[0]);
      }
      if (data.backImage?.[0]) {
        formData.append('backImage', data.backImage[0]);
      }

      const response = await fetch('/api/cards', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la carte');
      }

      await queryClient.invalidateQueries({ queryKey: [`/api/decks/${id}/cards`] });

      toast({
        title: "Carte créée",
        description: "La carte a été ajoutée avec succès",
      });

      cardForm.reset();
      setFrontImagePreview(null);
      setBackImagePreview(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la carte",
        variant: "destructive",
      });
    }
  };

  const deleteCard = async (cardId: number) => {
    try {
      await apiRequest("DELETE", `/api/cards/${cardId}`);
      await queryClient.invalidateQueries({ queryKey: [`/api/decks/${id}/cards`] });
      toast({
        title: "Carte supprimée",
        description: "La carte a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la carte",
        variant: "destructive",
      });
    }
  };

  if (isDeckLoading || areCardsLoading) {
    return <div className="h-[300px] bg-muted rounded-lg animate-pulse" />;
  }

  if (!deck) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Deck non trouvé</h2>
        <Button className="mt-4" onClick={() => setLocation("/")}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-4xl font-bold">Éditer {deck.name}</h1>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Cartes ({cards.length})</TabsTrigger>
          <TabsTrigger value="settings">Paramètres du deck</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Cartes du deck</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une carte
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Nouvelle carte</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle carte pour votre deck. Le recto et le verso sont obligatoires.
                  </DialogDescription>
                </DialogHeader>
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(onSubmitCard)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <FormField
                          control={cardForm.control}
                          name="front"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recto</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Contenu du recto de la carte"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cardForm.control}
                          name="frontImage"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Image Recto (optionnel)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleImageChange(e, 'front');
                                    }}
                                    {...field}
                                  />
                                  {frontImagePreview && (
                                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={frontImagePreview}
                                        alt="Aperçu recto"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={cardForm.control}
                          name="back"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verso</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Contenu du verso de la carte"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={cardForm.control}
                          name="backImage"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Image Verso (optionnel)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleImageChange(e, 'back');
                                    }}
                                    {...field}
                                  />
                                  {backImagePreview && (
                                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                      <img
                                        src={backImagePreview}
                                        alt="Aperçu verso"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={cardForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Notes ou informations supplémentaires"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="space-y-4">
              <AnimatePresence>
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CardUI>
                      <CardHeader className="relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedCard(card)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCard(card.id)}
                                  className="bg-red-500"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Recto</h3>
                          <div className="space-y-2">
                            <p className="text-muted-foreground">{card.front}</p>
                            {card.frontImage && (
                              <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={card.frontImage}
                                  alt="Image recto"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Verso</h3>
                          <div className="space-y-2">
                            <p className="text-muted-foreground">{card.back}</p>
                            {card.backImage && (
                              <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={card.backImage}
                                  alt="Image verso"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        {card.notes && (
                          <div className="mt-4 space-y-2">
                            <h3 className="font-semibold">Notes</h3>
                            <p className="text-sm text-muted-foreground">{card.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {card.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardFooter>
                    </CardUI>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings">
          <CardUI>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Paramètres du deck</h3>
              {/* Ajoutez ici les paramètres du deck */}
            </CardContent>
          </CardUI>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
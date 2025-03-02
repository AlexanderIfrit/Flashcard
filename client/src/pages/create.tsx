import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDeckSchema, type InsertDeck, type Deck } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Save, Plus } from "lucide-react";
import { useState } from "react";

export default function Create() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertDeck>({
    resolver: zodResolver(insertDeckSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  const onSubmit = async (data: InsertDeck) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest<Deck>("POST", "/api/decks", data);
      // Invalider le cache des decks pour forcer un rechargement
      await queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      toast({
        title: "Deck créé avec succès",
        description: "Vous pouvez maintenant ajouter des cartes à votre deck.",
      });
      // Rediriger vers la page d'édition du deck avec l'ID renvoyé par le serveur
      setLocation(`/edit/${response.id}`);
    } catch (error) {
      console.error("Erreur lors de la création du deck:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le deck. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <h1 className="text-4xl font-bold">Créer un nouveau deck</h1>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du deck</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Entrez le nom du deck" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu de votre deck"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ajoutez des tags séparés par des virgules"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                          field.onChange(tags);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Save className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Création..." : "Créer le deck"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
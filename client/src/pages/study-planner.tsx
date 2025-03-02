import { useQuery } from "@tanstack/react-query";
import { type Deck } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Target,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function StudyPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const [studyDuration, setStudyDuration] = useState("30");
  const [studyGoal, setStudyGoal] = useState("10");

  const { data: decks = [], isLoading } = useQuery<Deck[]>({
    queryKey: ["/api/decks"],
  });

  const stats = {
    todayCards: 45,
    weeklyProgress: 78,
    streakDays: 7,
    totalStudyTime: "12h 30m",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handlePlanSession = () => {
    // TODO: Implémenter la planification de session
    console.log({
      date: selectedDate,
      deckId: selectedDeck,
      duration: studyDuration,
      goal: studyGoal,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Planificateur d'études</h1>
        <Button>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Nouvelle session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cartes aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.todayCards}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progrès hebdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.weeklyProgress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              Série actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.streakDays} jours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Temps total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudyTime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Planifier une session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Deck à étudier</Label>
              <Select value={selectedDeck} onValueChange={setSelectedDeck}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un deck" />
                </SelectTrigger>
                <SelectContent>
                  {decks.map((deck) => (
                    <SelectItem key={deck.id} value={deck.id.toString()}>
                      {deck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durée de la session (minutes)</Label>
              <Input
                type="number"
                value={studyDuration}
                onChange={(e) => setStudyDuration(e.target.value)}
                min="5"
                max="120"
                step="5"
              />
            </div>

            <div className="space-y-2">
              <Label>Objectif de cartes</Label>
              <Input
                type="number"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                min="5"
                max="100"
                step="5"
              />
            </div>

            <Button onClick={handlePlanSession} className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Planifier la session
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              locale={fr}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions planifiées</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="week">Cette semaine</TabsTrigger>
              <TabsTrigger value="month">Ce mois</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="space-y-4">
              {/* TODO: Afficher les sessions du jour */}
              <div className="text-center text-muted-foreground py-8">
                Aucune session planifiée pour aujourd'hui
              </div>
            </TabsContent>
            <TabsContent value="week">
              {/* TODO: Afficher les sessions de la semaine */}
            </TabsContent>
            <TabsContent value="month">
              {/* TODO: Afficher les sessions du mois */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

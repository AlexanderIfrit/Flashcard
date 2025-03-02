import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Palette, Volume2, Vibrate, Globe } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [theme, setTheme] = useState("purple");

  const themes = [
    { value: "purple", label: "Violet Futuriste", color: "hsl(250, 85%, 65%)" },
    { value: "blue", label: "Bleu Électrique", color: "hsl(210, 85%, 65%)" },
    { value: "green", label: "Vert Néon", color: "hsl(150, 85%, 65%)" },
    { value: "pink", label: "Rose Cyberpunk", color: "hsl(330, 85%, 65%)" },
  ];

  const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "de", label: "Deutsch" },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implement dark mode toggle with theme context
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // TODO: Implement sound settings with context
  };

  const toggleVibration = () => {
    setVibrationEnabled(!vibrationEnabled);
    // TODO: Implement vibration settings with context
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    // TODO: Implement theme change with theme context
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // TODO: Implement language change with i18n context
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold">Paramètres</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Mode sombre</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un thème" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(({ value, label, color }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Langue et région
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Langue de l'interface</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Son et retour haptique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <Label htmlFor="sound">Sons de l'interface</Label>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={toggleSound}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="h-5 w-5" />
                <Label htmlFor="vibration">Retour haptique</Label>
              </div>
              <Switch
                id="vibration"
                checked={vibrationEnabled}
                onCheckedChange={toggleVibration}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données et exportation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Exporter mes decks (JSON)
            </Button>
            <Button variant="outline" className="w-full">
              Exporter mes statistiques
            </Button>
            <Button variant="destructive" className="w-full">
              Réinitialiser les paramètres
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

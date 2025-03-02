import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Brain, ListChecks, ChevronLeft, ChevronRight, Settings, Library, BookOpen, Star, Tags } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  badge?: string;
}

export default function NavSidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [deckCount, setDeckCount] = useState(0);

  useEffect(() => {
    // Fetch deck count
    fetch("/api/decks")
      .then(res => res.json())
      .then(decks => setDeckCount(decks.length))
      .catch(console.error);
  }, []);

  const mainNavItems: NavItem[] = [
    { 
      href: "/", 
      icon: Home, 
      label: "Accueil",
      description: "Vue d'ensemble de vos decks",
      badge: deckCount > 0 ? deckCount.toString() : undefined
    },
    { 
      href: "/create", 
      icon: PlusCircle, 
      label: "Créer",
      description: "Créer un nouveau deck de flashcards"
    },
    { 
      href: "/library", 
      icon: Library, 
      label: "Bibliothèque",
      description: "Parcourir tous vos decks"
    },
    { 
      href: "/study-planner", 
      icon: BookOpen, 
      label: "Planning",
      description: "Organiser vos sessions d'étude"
    }
  ];

  const bottomNavItems: NavItem[] = [
    { 
      href: "/favorites", 
      icon: Star, 
      label: "Favoris",
      description: "Vos decks favoris"
    },
    { 
      href: "/tags", 
      icon: Tags, 
      label: "Tags",
      description: "Gérer vos tags et catégories"
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Paramètres",
      description: "Personnaliser l'application"
    }
  ];

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "72px" }
  };

  const NavItemComponent = ({ item, isBottom = false }: { item: NavItem; isBottom?: boolean }) => (
    <TooltipProvider>
      <Tooltip delayDuration={isCollapsed ? 100 : 1000}>
        <TooltipTrigger asChild>
          <Link href={item.href}>
            <Button
              variant={location === item.href ? "default" : "ghost"}
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start gap-4 transition-all duration-200",
                location === item.href && "bg-primary text-primary-foreground",
                isBottom && "opacity-80 hover:opacity-100"
              )}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isCollapsed && item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        {(isCollapsed || item.description) && (
          <TooltipContent side="right" className="max-w-[200px]">
            <div className="space-y-1">
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <motion.nav
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial={false}
      className={cn(
        "relative h-screen border-r bg-card px-3 py-4 transition-all duration-300",
        isHovered && isCollapsed && "shadow-lg"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Flashcards</h1>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        <div className="my-6 border-t" />

        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} isBottom />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
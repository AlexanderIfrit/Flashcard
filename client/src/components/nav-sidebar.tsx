import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Brain, ListChecks } from "lucide-react";

export default function NavSidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/create", icon: PlusCircle, label: "Create" },
  ];

  return (
    <nav className="w-64 border-r bg-card p-4">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Flashcards</h1>
      </div>
      
      <div className="space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <a
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                location === href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}

import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import NavSidebar from "@/components/nav-sidebar";
import Home from "./pages/home";
import Create from "./pages/create";
import Study from "./pages/study";
import Quiz from "./pages/quiz";
import Edit from "./pages/edit";
import Favorites from "./pages/favorites";
import Tags from "./pages/tags";
import Settings from "./pages/settings";
import Library from "./pages/library";
import StudyPlanner from "./pages/study-planner";

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create" component={Create} />
          <Route path="/study/:id" component={Study} />
          <Route path="/quiz/:id" component={Quiz} />
          <Route path="/edit/:id" component={Edit} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/tags" component={Tags} />
          <Route path="/settings" component={Settings} />
          <Route path="/library" component={Library} />
          <Route path="/study-planner" component={StudyPlanner} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}
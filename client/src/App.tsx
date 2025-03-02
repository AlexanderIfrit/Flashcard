import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Create from "@/pages/create";
import Study from "@/pages/study";
import Quiz from "@/pages/quiz";
import NavSidebar from "@/components/nav-sidebar";

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
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

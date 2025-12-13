import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Post from "@/pages/Post";
import Notifications from "@/pages/Notifications";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import SmartAssistant from "@/pages/SmartAssistant";
import NotFound from "@/pages/not-found";
import { MobileLayout } from "@/components/layout/MobileLayout";

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/post" component={Post} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/chat" component={Chat} />
        <Route path="/profile" component={Profile} />
        <Route path="/assistant" component={SmartAssistant} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;

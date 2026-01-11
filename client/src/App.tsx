import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import Post from "@/pages/Post";
import Notifications from "@/pages/Notifications";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import SmartAssistant from "@/pages/SmartAssistant";
import ProductDetails from "@/pages/ProductDetails";
import Tenders from "@/pages/Tenders";
import NotFound from "@/pages/not-found";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

function Router() {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading Krishi Bajar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sprout className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Krishi Bajar</h1>
            <p className="text-muted-foreground mt-2">Connecting farmers directly to the market.</p>
          </div>
          <Button 
            onClick={login}
            size="lg" 
            className="w-full h-14 rounded-xl text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
          >
            Login with Google
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Empowering Nepali Farmers</p>
        </div>
      </div>
    );
  }

  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/post" component={Post} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/chat" component={Chat} />
        <Route path="/profile" component={Profile} />
        <Route path="/assistant" component={SmartAssistant} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/tenders" component={Tenders} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

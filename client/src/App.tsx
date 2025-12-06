import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import ScanWebsite from "@/pages/scan-website";
import CreateBot from "@/pages/create-bot";
import ChatbotSettings from "@/pages/chatbot-settings";
import ChatTest from "@/pages/chat-test";
import { Loader2 } from "lucide-react";

// Protected Route wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

// Public Route wrapper (redirects to dashboard if logged in)
function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/login">
        <PublicRoute component={Login} />
      </Route>
      <Route path="/signup">
        <PublicRoute component={Signup} />
      </Route>
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard/scan-website">
        <ProtectedRoute component={ScanWebsite} />
      </Route>
      <Route path="/dashboard/create-bot">
        <ProtectedRoute component={CreateBot} />
      </Route>
      <Route path="/dashboard/chatbot/:id">
        <ProtectedRoute component={ChatbotSettings} />
      </Route>
      
      {/* Public chat test route */}
      <Route path="/chat/test/:id" component={ChatTest} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

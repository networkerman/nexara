import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import Pricing from "./pages/Pricing";
import Campaigns from "./pages/Campaigns";
import PremiumGate from "./pages/PremiumGate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/engage/campaigns" element={<Campaigns />} />
            <Route path="/dashboards" element={<PremiumGate feature="Dashboards" />} />
            <Route path="/engage" element={<PremiumGate feature="Engage Hub" />} />
            <Route path="/engage/journey" element={<PremiumGate feature="Journey Builder" />} />
            <Route path="/engage/onsite" element={<PremiumGate feature="On-site Messages" />} />
            <Route path="/audiences" element={<PremiumGate feature="Audiences" />} />
            <Route path="/content" element={<PremiumGate feature="Content Management" />} />
            <Route path="/analytics" element={<PremiumGate feature="Analytics" />} />
            <Route path="/premium/:feature" element={<PremiumGate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

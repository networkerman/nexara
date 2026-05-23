import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth & onboarding
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// OneXtel 9-section navigation
import Campaigns from "./pages/Campaigns";
import Journeys from "./pages/Journeys";
import Content from "./pages/Content";
import Reports from "./pages/Reports";
import Channels from "./pages/Channels";
import Governance from "./pages/Governance";
import SettingsPage from "./pages/SettingsPage";
import Audiences from "./pages/Audiences";
import PremiumGate from "./pages/PremiumGate"; // placeholder for pending modules

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root — Home dashboard */}
            <Route path="/" element={<Index />} />

            {/* Auth flows */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* ── OneXtel 9-section nav ─────────────────────────────── */}
            <Route path="/campaigns/*" element={<Campaigns />} />
            <Route path="/journeys/*"  element={<Journeys />} />
            <Route path="/audiences/*" element={<Audiences />} />
            <Route path="/content/*"   element={<Content />} />
            <Route path="/reports/*"   element={<Reports />} />
            <Route path="/channels/*"  element={<Channels />} />
            <Route path="/governance/*" element={<Governance />} />
            <Route path="/settings/*"  element={<SettingsPage />} />

            {/* Legacy redirects — keep old Aura-style paths working */}
            <Route path="/engage/campaigns" element={<Campaigns />} />
            <Route path="/dashboards"       element={<Index />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

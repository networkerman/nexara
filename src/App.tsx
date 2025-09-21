import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import Pricing from "./pages/Pricing";
import Campaigns from "./pages/Campaigns";
import SupabaseTest from "./pages/SupabaseTest";
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
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            <Route path="/welcome" element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            } />
            
            <Route path="/pricing" element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            } />
            
            {/* Active/Implemented Routes */}
            <Route path="/engage/campaigns" element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="/supabase-test" element={<SupabaseTest />} />
            
            {/* Premium-gated / Unfinished Routes */}
            <Route path="/dashboards" element={
              <ProtectedRoute>
                <PremiumGate feature="Dashboards" />
              </ProtectedRoute>
            } />
            <Route path="/engage" element={
              <ProtectedRoute>
                <PremiumGate feature="Engage Hub" />
              </ProtectedRoute>
            } />
            <Route path="/engage/journey" element={
              <ProtectedRoute>
                <PremiumGate feature="Journey Builder" />
              </ProtectedRoute>
            } />
            <Route path="/engage/onsite" element={
              <ProtectedRoute>
                <PremiumGate feature="On-site Messages" />
              </ProtectedRoute>
            } />
            <Route path="/audiences" element={
              <ProtectedRoute>
                <PremiumGate feature="Audiences" />
              </ProtectedRoute>
            } />
            <Route path="/content" element={
              <ProtectedRoute>
                <PremiumGate feature="Content Management" />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <PremiumGate feature="Analytics" />
              </ProtectedRoute>
            } />
            
            {/* Dynamic premium route for future features */}
            <Route path="/premium/:feature" element={
              <ProtectedRoute>
                <PremiumGate />
              </ProtectedRoute>
            } />
            
            {/* App-level 404 for unknown routes (rarely triggered due to Netlify fallback) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

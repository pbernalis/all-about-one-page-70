
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import StudioPage from "./pages/StudioPage";
import StudioModern from "./pages/StudioModern";
import AITestPage from "./pages/AITestPage";
import StudioPick from "./pages/StudioPick";
import StudioRedirect from "./pages/StudioRedirect";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import PreviewView from "./pages/PreviewView";
import CMSDemo from "./pages/CMSDemo";
import PagesList from "./pages/PagesList";
import RequireEditor from "./components/auth/RequireEditor";
import { ConnectionStatus } from "@/components/ui/connection-status";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ConnectionStatus />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/pages" replace />} />
              <Route path="/studio" element={<StudioRedirect />} />
              <Route path="/studio/_pick" element={<StudioPick />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/studio/chat" 
                element={
                  <RequireEditor>
                    <StudioModern />
                  </RequireEditor>
                } 
              />
              <Route 
                path="/studio/:id" 
                element={
                  <RequireEditor>
                    <StudioPage />
                  </RequireEditor>
                } 
              />
              <Route 
                path="/studio/modern/:siteSlug" 
                element={
                  <RequireEditor>
                    <StudioModern />
                  </RequireEditor>
                } 
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/view" element={<PreviewView />} />
              <Route path="/ai-test" element={<AITestPage />} />
              <Route path="/cms-demo" element={<CMSDemo />} />
              <Route 
                path="/pages" 
                element={
                  <RequireEditor>
                    <PagesList />
                  </RequireEditor>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

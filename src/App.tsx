
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import { createOptimizedQueryClient } from "@/shared/perf/queryConfig";

// Lazy load heavy pages for better initial load performance
const Index = lazy(() => import("./pages/Index"));
const StudioPage = lazy(() => import("./pages/StudioPage"));
const StudioModern = lazy(() => import("./pages/StudioModern"));
const AITestPage = lazy(() => import("./pages/AITestPage"));
const CMSDemo = lazy(() => import("./pages/CMSDemo"));
const PreviewView = lazy(() => import("./pages/PreviewView"));

// Keep light pages as regular imports
import StudioPick from "./pages/StudioPick";
import StudioRedirect from "./pages/StudioRedirect";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import PagesList from "./pages/PagesList";
import RequireEditor from "./components/auth/RequireEditor";
import { ConnectionStatus } from "@/components/ui/connection-status";

// Create optimized QueryClient with performance settings
const queryClient = createOptimizedQueryClient();

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
              
              {/* Lazy-loaded heavy routes with Suspense */}
              <Route 
                path="/studio/chat" 
                element={
                  <RequireEditor>
                    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading Studio...</div>}>
                      <StudioModern />
                    </Suspense>
                  </RequireEditor>
                } 
              />
              <Route 
                path="/studio/:id" 
                element={
                  <RequireEditor>
                    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading Studio...</div>}>
                      <StudioPage />
                    </Suspense>
                  </RequireEditor>
                } 
              />
              <Route 
                path="/studio/modern/:siteSlug" 
                element={
                  <RequireEditor>
                    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading Studio...</div>}>
                      <StudioModern />
                    </Suspense>
                  </RequireEditor>
                } 
              />
              
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/view" 
                element={
                  <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading Preview...</div>}>
                    <PreviewView />
                  </Suspense>
                } 
              />
              <Route 
                path="/ai-test" 
                element={
                  <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading AI Test...</div>}>
                    <AITestPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/cms-demo" 
                element={
                  <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading CMS Demo...</div>}>
                    <CMSDemo />
                  </Suspense>
                } 
              />
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

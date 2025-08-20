import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/components/LanguageSelector";
import { store } from "@/store/store";
import { loadUserFromStorage } from "@/store/slices/authSlice";
import { AuthGuard } from "@/components/AuthGuard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ModeratorsDashboard from "./pages/ModeratorsDashboard";
import CaseDetail from "./pages/CaseDetail";

const queryClient = new QueryClient();

// Component to initialize auth state from localStorage
const AuthInitializer = () => {
  useEffect(() => {
    store.dispatch(loadUserFromStorage());
  }, []);
  return null;
};

const App = () => (
  <Provider store={store}>
    <AuthInitializer />
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthGuard
                    allowedRoles={[
                      "admin",
                      "moderator",
                      "senior_moderator",
                      "third_party",
                    ]}
                  >
                    <ModeratorsDashboard />
                  </AuthGuard>
                }
              />

              <Route
                path="/auth"
                element={
                  <AuthGuard requireAuth={false} redirectAuthenticatedTo="/">
                    <Auth />
                  </AuthGuard>
                }
              />

              <Route
                path="/case/:id"
                element={
                  <AuthGuard
                    allowedRoles={[
                      "admin",
                      "moderator",
                      "senior_moderator",
                      "third_party",
                    ]}
                  >
                    <CaseDetail />
                  </AuthGuard>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

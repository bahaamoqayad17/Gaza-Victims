import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { store } from "@/store/store";
import { loadUserFromStorage } from "@/store/slices/authSlice";
import { validLanguages } from "@/components/LanguageSelector";
import { Language } from "@/lib/translations";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Browse from "./pages/Browse";
import CaseDetail from "./pages/CaseDetail";
import Map from "./pages/Map";
import About from "./pages/About";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import DownloadArchive from "./pages/DownloadArchive";
import ReportCase from "./pages/ReportCase";
import ReportAdditional from "./pages/ReportAdditional";
import ReviewCase from "./pages/ReviewCase";
import CaseSubmitted from "./pages/CaseSubmitted";

const queryClient = new QueryClient();

// Component to initialize auth state from localStorage
const AuthInitializer = () => {
  useEffect(() => {
    store.dispatch(loadUserFromStorage());
  }, []);
  return null;
};

// Component to redirect root path to default language
const RootRedirect = () => {
  return <Navigate to="/ar" replace />;
};

// Component to redirect case route with language
const CaseRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/ar/case/${id}`} replace />;
};

// Component to validate language and redirect if invalid
const LanguageRoute = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();

  if (lang && !validLanguages.includes(lang as Language)) {
    return <Navigate to="/ar" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <Provider store={store}>
    <AuthInitializer />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root path redirects to default language */}
            <Route path="/" element={<RootRedirect />} />

            {/* Language-prefixed routes */}
            <Route
              path="/:lang"
              element={
                <LanguageRoute>
                  <Index />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/upload"
              element={
                <LanguageRoute>
                  <Upload />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/browse"
              element={
                <LanguageRoute>
                  <Browse />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/case-submitted"
              element={
                <LanguageRoute>
                  <CaseSubmitted />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/map"
              element={
                <LanguageRoute>
                  <Map />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/about"
              element={
                <LanguageRoute>
                  <About />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/case/:id"
              element={
                <LanguageRoute>
                  <CaseDetail />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/legal"
              element={
                <LanguageRoute>
                  <Legal />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/download-archive"
              element={
                <LanguageRoute>
                  <DownloadArchive />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/report"
              element={
                <LanguageRoute>
                  <ReportCase />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/report-additional"
              element={
                <LanguageRoute>
                  <ReportAdditional />
                </LanguageRoute>
              }
            />
            <Route
              path="/:lang/review-case"
              element={
                <LanguageRoute>
                  <ReviewCase />
                </LanguageRoute>
              }
            />

            {/* Legacy routes without language - redirect to /ar */}
            <Route
              path="/upload"
              element={<Navigate to="/ar/upload" replace />}
            />
            <Route
              path="/browse"
              element={<Navigate to="/ar/browse" replace />}
            />
            <Route
              path="/case-submitted"
              element={<Navigate to="/ar/case-submitted" replace />}
            />
            <Route path="/map" element={<Navigate to="/ar/map" replace />} />
            <Route
              path="/about"
              element={<Navigate to="/ar/about" replace />}
            />
            <Route path="/case/:id" element={<CaseRedirect />} />
            <Route
              path="/legal"
              element={<Navigate to="/ar/legal" replace />}
            />
            <Route
              path="/download-archive"
              element={<Navigate to="/ar/download-archive" replace />}
            />
            <Route
              path="/report"
              element={<Navigate to="/ar/report" replace />}
            />
            <Route
              path="/report-additional"
              element={<Navigate to="/ar/report-additional" replace />}
            />
            <Route
              path="/review-case"
              element={<Navigate to="/ar/review-case" replace />}
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

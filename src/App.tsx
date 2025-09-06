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
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/case-submitted" element={<CaseSubmitted />} />
              <Route path="/map" element={<Map />} />
              <Route path="/about" element={<About />} />
              <Route path="/case/:id" element={<CaseDetail />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/download-archive" element={<DownloadArchive />} />
              <Route path="/report" element={<ReportCase />} />
              <Route path="/report-additional" element={<ReportAdditional />} />
              <Route path="/review-case" element={<ReviewCase />} />
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

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/components/LanguageSelector";
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
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/download" element={<DownloadArchive />} />
            <Route path="/report" element={<ReportCase />} />
            <Route path="/report-additional" element={<ReportAdditional />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

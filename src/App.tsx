import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TopUp from "./pages/TopUp";
import Transfer from "./pages/Transfer";
import History from "./pages/History";
import Payment from "./pages/Payment";
import QRIS from "./pages/QRIS";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { WalletProvider } from "@/context/WalletContext";
import { ScrollToTop } from '@/components/layout/ScrollToTop';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/history" element={<History />} />
          <Route path="/payment/:type" element={<Payment />} />
          <Route path="/qris" element={<QRIS />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
     </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

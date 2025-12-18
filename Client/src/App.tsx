import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "./components/ui/sonner";
import Auth from "./features/auth";
import CustomerDashboard from "./features/user/dashboard";
import OfficeBoyDashboard from "./features/office-boy/dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
  <Route path="/" element={<Auth />} />
  <Route path="/dashboard" element={<CustomerDashboard />} />
  <Route path="/office-boy" element={<OfficeBoyDashboard />} />
</Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

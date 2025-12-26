import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Certificados from "./pages/Certificados";
import Equipamentos from "./pages/Equipamentos";
import LicencasOffice from "./pages/LicencasOffice";
import Usuarios from "./pages/Usuarios";
import Monitoramento from "./pages/Monitoramento";
import Perfil from "./pages/Perfil";
import ChamadosRCN from "./pages/ChamadosRCN";
import ChamadosInternos from "./pages/ChamadosInternos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/certificados" element={<Certificados />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/licencas-office" element={<LicencasOffice />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/monitoramento" element={<Monitoramento />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/chamados-rcn" element={<ChamadosRCN />} />
            <Route path="/chamados-internos" element={<ChamadosInternos />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

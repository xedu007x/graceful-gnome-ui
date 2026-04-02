import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home.tsx";
import CnabRecebimentos from "./pages/CnabRecebimentos.tsx";
import ConsultaContratos from "./pages/ConsultaContratos.tsx";
import VisualizacaoContrato from "./pages/VisualizacaoContrato.tsx";
import ConsultaOficios from "./pages/ConsultaOficios.tsx";
import VisualizacaoParcela from "./pages/VisualizacaoParcela.tsx";
import FundoInvestimentos from "./pages/FundoInvestimentos.tsx";
import CotasDiarias from "./pages/CotasDiarias.tsx";
import EmissaoTEC from "./pages/EmissaoTEC.tsx";
import GerenciarTEC from "./pages/GerenciarTEC.tsx";
import AcompanhamentoTEC from "./pages/AcompanhamentoTEC.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contratos" element={<ConsultaContratos />} />
          <Route path="/contrato/:id" element={<VisualizacaoContrato />} />
          <Route path="/oficios" element={<ConsultaOficios />} />
          <Route path="/oficio/:oficioId/parcela/:parcelaId" element={<VisualizacaoParcela />} />
          <Route path="/cnab-recebimentos" element={<CnabRecebimentos />} />
          <Route path="/fundo-investimentos" element={<FundoInvestimentos />} />
          <Route path="/fundo-investimento/:fundoId/cotas" element={<CotasDiarias />} />
          <Route path="/emissao-tec" element={<EmissaoTEC />} />
          <Route path="/emissao-tec/:tecId" element={<EmissaoTEC />} />
          <Route path="/gerenciar-tec/:tecId" element={<GerenciarTEC />} />
          <Route path="/acompanhamento-tec" element={<AcompanhamentoTEC />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Search } from "lucide-react";

const VisualizacaoParcela = () => {
  const navigate = useNavigate();
  const { oficioId, parcelaId } = useParams();

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span>
          <span>Ofícios</span>
          <span>{">"}</span>
          <span>Gerenciar Ofício/Parcelas</span>
          <span>{">"}</span>
          <span>Visualização de Ofício</span>
          <span>{">"}</span>
          <span>Lista de Parcelas</span>
          <span>{">"}</span>
          <span className="text-brand font-medium">Visualização da Parcela</span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            <Search className="h-4 w-4 mr-2" />
            Visualizar Histórico
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            <Search className="h-4 w-4 mr-2" />
            Integrações
          </Button>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">Detalhes da Parcela Nº {parcelaId || "1"}</h2>

        <div className="mb-6">
          <p className="text-sm text-foreground">Número do Contrato: <span className="font-medium">045/2026</span></p>
          <p className="text-sm text-foreground">Código de Empreendimento: <span className="font-medium">2025-RB_COB-171</span></p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-md mb-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              N. da Parcela <span className="text-destructive">*</span>
            </label>
            <Input value={parcelaId || "1"} readOnly className="mt-1 w-24" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Valor da Parcela <span className="text-destructive">*</span>
            </label>
            <Input value="10.000,00" readOnly className="mt-1 w-40" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10">
          <Checkbox id="liberar" />
          <label htmlFor="liberar" className="text-sm text-foreground cursor-pointer">
            Liberar para Pagamento
          </label>
        </div>

        <div className="flex items-center justify-between max-w-lg">
          <Button variant="outline" className="rounded-full px-8 border-brand text-brand hover:bg-brand/10" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-8">
            Excluir
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualizacaoParcela;

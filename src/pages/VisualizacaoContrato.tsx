import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Download } from "lucide-react";

const dadosMock: Record<string, { cnpj: string; razaoSocial: string; segmento: string; endereco: string; cep: string; estado: string; municipio: string; bairro: string }> = {
  "1": { cnpj: "44.959.021/0001-04", razaoSocial: "MUNICIPIO DE GUARUJA", segmento: "Município", endereco: "AVENIDA SANTOS DUMONT, 800", cep: "11432-440", estado: "São Paulo", municipio: "Guarujá", bairro: "VILA SANTO ANTONIO" },
  "2": { cnpj: "44.959.021/0001-04", razaoSocial: "MUNICIPIO DE GUARUJA", segmento: "Município", endereco: "AVENIDA SANTOS DUMONT, 800", cep: "11432-440", estado: "São Paulo", municipio: "Guarujá", bairro: "VILA SANTO ANTONIO" },
  "4": { cnpj: "64.037.815/0001-28", razaoSocial: "MUNICIPIO DE CAJATI", segmento: "Município", endereco: "PRACA PACO MUNICIPAL 10", cep: "11950-000", estado: "São Paulo", municipio: "Cajati", bairro: "CENTRO" },
};

const VisualizacaoContrato = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dados = dadosMock[id || "1"] || dadosMock["1"];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span>
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/contratos")}>Lista de Contrato</span>
          <span>{">"}</span>
          <span className="text-brand font-medium">Visualização de Contrato</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">Visualização do Contrato</h2>

        <div className="flex items-center gap-3 mb-8">
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            <Download className="h-4 w-4 mr-2" /> Baixar contrato
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            Visualizar Histórico
          </Button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-sm font-medium">Tomador</span>
          </div>
          <div className="flex-1 h-px bg-border mx-4" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-sm text-muted-foreground">Empreendimento</span>
          </div>
          <div className="flex-1 h-px bg-border mx-4" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-sm text-muted-foreground">Agente Técnico</span>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-brand">CNPJ <span className="text-destructive">*</span></label>
              <Input value={dados.cnpj} readOnly className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-brand">Nome/Razão Social <span className="text-destructive">*</span></label>
              <Input value={dados.razaoSocial} readOnly className="mt-1" />
            </div>
          </div>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-brand">Segmento <span className="text-destructive">*</span></label>
            <Select value={dados.segmento}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Município">Município</SelectItem>
                <SelectItem value="Estado">Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Endereço */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-brand">Endereço <span className="text-destructive">*</span></label>
              <Input value={dados.endereco} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-brand">CEP <span className="text-destructive">*</span></label>
              <Input value={dados.cep} readOnly className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-brand">Estado <span className="text-destructive">*</span></label>
              <Select value={dados.estado}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="São Paulo">São Paulo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-brand">Município <span className="text-destructive">*</span></label>
              <Select value={dados.municipio}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={dados.municipio}>{dados.municipio}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-brand">Bairro <span className="text-destructive">*</span></label>
              <Input value={dados.bairro} readOnly className="mt-1" />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-4 mb-8">
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8" onClick={() => navigate("/contratos")}>
            Voltar
          </Button>
          <Button variant="destructive" className="rounded-full px-8">
            Excluir
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisualizacaoContrato;

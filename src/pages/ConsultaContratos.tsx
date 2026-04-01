import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Home } from "lucide-react";

interface Contrato {
  id: number;
  nContrato: string;
  codigoEmpreendimento: string;
  tomador: string;
  status: string;
  valorFinanciamento: number;
}

const dadosMock: Contrato[] = [
  { id: 1, nContrato: "", codigoEmpreendimento: "2025-BS_COB-192", tomador: "MUNICÍPIO DE GUARUJÁ", status: "Importado", valorFinanciamento: 3390408.51 },
  { id: 2, nContrato: "", codigoEmpreendimento: "2025-BS_COB-191", tomador: "MUNICÍPIO DE GUARUJÁ", status: "Importado", valorFinanciamento: 577395.12 },
  { id: 3, nContrato: "", codigoEmpreendimento: "2025-RB_COB-179", tomador: "PREFEITURA MUNICIPAL DE ITARIRI", status: "Importado", valorFinanciamento: 293106.45 },
  { id: 4, nContrato: "", codigoEmpreendimento: "2025-RB_COB-171", tomador: "MUNICÍPIO DE CAJATI", status: "Importado", valorFinanciamento: 481476.58 },
  { id: 5, nContrato: "", codigoEmpreendimento: "2025-RB_COB-182", tomador: "PREFEITURA MUNICIPAL DE ITAOCA", status: "Importado", valorFinanciamento: 986176.22 },
  { id: 6, nContrato: "", codigoEmpreendimento: "2025-RB_COB-183", tomador: "PREFEITURA MUNICIPAL DE ITAOCA", status: "Importado", valorFinanciamento: 600000.00 },
  { id: 7, nContrato: "", codigoEmpreendimento: "2025-RB_COB-167", tomador: "MUNICÍPIO DE IGUAPE", status: "Importado", valorFinanciamento: 271376.43 },
  { id: 8, nContrato: "", codigoEmpreendimento: "2025-TG_COB-67", tomador: "PREFEITURA MUNICIPAL DE GUAPIAÇU", status: "Importado", valorFinanciamento: 810804.34 },
];

const ConsultaContratos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span>
          <span className="text-brand font-medium">Lista de Contrato</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">Consulta de Contratos</h2>

        <div className="flex items-center gap-4 mb-4">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-[220px] rounded-full">
              <SelectValue placeholder="Selecione um filtro:" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="tomador">Tomador</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">
            Consultar
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3 mb-4">
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            Importar Sinfehidro
          </Button>
          <Button variant="outline" className="rounded-full px-6 border-brand text-brand hover:bg-brand/10">
            Importar Excel
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">
            Novo contrato
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-dark hover:bg-brand-dark">
                <TableHead className="text-brand-foreground font-bold text-center">Nº contrato</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Código Empreendimento</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Tomador</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Status</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Valor Financiamento</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosMock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{item.nContrato}</TableCell>
                  <TableCell className="text-center">{item.codigoEmpreendimento}</TableCell>
                  <TableCell>{item.tomador}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-brand font-medium">{item.status}</span>
                  </TableCell>
                  <TableCell className="text-center">{formatCurrency(item.valorFinanciamento)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/contrato/${item.id}`)}
                    >
                      <Search className="h-4 w-4 text-brand" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ConsultaContratos;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Home, Search, DollarSign } from "lucide-react";

interface Oficio {
  id: number;
  numeroContrato: string;
  codigoEmpreendimento: string;
  bacia: string;
  fonteRecurso: string;
  tomador: string;
  limitePrimeiraParcela: string;
  status: string;
}

const dadosMock: Oficio[] = [
  { id: 1, numeroContrato: "045/2026", codigoEmpreendimento: "2025-RB_COB-171", bacia: "42145", fonteRecurso: "Cobrança", tomador: "MUNICIPIO DE CAJATI", limitePrimeiraParcela: "102 Dias Restantes", status: "Cadastrado" },
  { id: 2, numeroContrato: "044/2026", codigoEmpreendimento: "THOMPG-01 01/04/26", bacia: "42030", fonteRecurso: "Cobrança", tomador: "Alicia e Iago Construções Ltda", limitePrimeiraParcela: "300 Dias Restantes", status: "Cadastrado" },
  { id: 3, numeroContrato: "043/2026", codigoEmpreendimento: "2025-BS_COB-192", bacia: "42056", fonteRecurso: "Cobrança", tomador: "MUNICÍPIO DE GUARUJÁ", limitePrimeiraParcela: "102 Dias Restantes", status: "Cadastrado" },
  { id: 4, numeroContrato: "042/2026", codigoEmpreendimento: "TDEVPG-01 18/03/26", bacia: "42030", fonteRecurso: "Cobrança", tomador: "Betina e Cecília Casa Noturna ME", limitePrimeiraParcela: "1ª liberada", status: "Pago" },
  { id: 5, numeroContrato: "041/2026", codigoEmpreendimento: "TDEVPG-01 16/03/26", bacia: "42030", fonteRecurso: "Cobrança", tomador: "Carolina e Maya Ferragens Ltda", limitePrimeiraParcela: "1ª liberada", status: "Pago" },
  { id: 6, numeroContrato: "002/2026", codigoEmpreendimento: "2026TB06", bacia: "42196", fonteRecurso: "Cobrança", tomador: "Macieira", limitePrimeiraParcela: "1ª liberada", status: "Pago Parcialmente" },
  { id: 7, numeroContrato: "06/2026", codigoEmpreendimento: "2026TB06", bacia: "42196", fonteRecurso: "Cobrança", tomador: "Macieira", limitePrimeiraParcela: "277 Dias Restantes", status: "Estornado" },
  { id: 8, numeroContrato: "002/2027", codigoEmpreendimento: "12030-180", bacia: "41203", fonteRecurso: "Compensação", tomador: "Prefeitura de Água Azul", limitePrimeiraParcela: "274 Dias Restantes", status: "Cadastrado" },
  { id: 9, numeroContrato: "001/2027", codigoEmpreendimento: "2012-SMT_COB-49", bacia: "41203", fonteRecurso: "Compensação", tomador: "MUNICIPIO DE TAUBATE", limitePrimeiraParcela: "0 Dias Restantes", status: "Aprovado nível 1" },
  { id: 10, numeroContrato: "040/2026", codigoEmpreendimento: "TDEVPG-01 05/03/26", bacia: "42030", fonteRecurso: "Cobrança", tomador: "Carolina e Maya Ferragens Ltda", limitePrimeiraParcela: "1ª liberada", status: "Recusado" },
];

const ConsultaOficios = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [busca, setBusca] = useState("");

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span>
          <span>Ofícios</span>
          <span>{">"}</span>
          <span className="text-brand font-medium">Gerenciar Ofício/Parcelas</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">Consulta de Ofícios</h2>

        <div className="flex items-center gap-4 mb-6">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="Nº Contrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nContrato">Nº Contrato</SelectItem>
              <SelectItem value="tomador">Tomador</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder=""
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-[200px] rounded-full"
          />
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">
            Consultar
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-dark hover:bg-brand-dark">
                <TableHead className="text-brand-foreground font-bold text-center">Número Contrato</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Código Empreendimento</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Bacia</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Fonte de Recurso</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Tomador</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Limite 1ª Parcela</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Status</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosMock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{item.numeroContrato}</TableCell>
                  <TableCell className="text-center">{item.codigoEmpreendimento}</TableCell>
                  <TableCell className="text-center">{item.bacia}</TableCell>
                  <TableCell className="text-center">{item.fonteRecurso}</TableCell>
                  <TableCell>{item.tomador}</TableCell>
                  <TableCell className="text-center">{item.limitePrimeiraParcela}</TableCell>
                  <TableCell className="text-center">
                    <span className={
                      item.status === "Pago" ? "text-success font-medium" :
                      item.status === "Recusado" ? "text-destructive font-medium" :
                      item.status === "Estornado" ? "text-warning font-medium" :
                      "text-foreground"
                    }>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/oficio/${item.id}/parcela/1`)}>
                        <DollarSign className="h-4 w-4 text-brand" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4 text-brand" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4 text-sm text-muted-foreground">
          <span>Itens por página</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>1 - 10 de 1938</span>
        </div>
      </div>
    </div>
  );
};

export default ConsultaOficios;

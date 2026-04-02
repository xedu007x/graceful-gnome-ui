import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Calendar } from "lucide-react";

const dados = [
  { id: 1, nome: "BB RENDA FIXA", operador: "Eduardo Dias Cordiero", vigencia: "01/04/2026 até 12/02/2030", ativo: true },
  { id: 2, nome: "BB AGÊNCIA", operador: "Sergio Ovalle Marcelo", vigencia: "27/08/2024", ativo: true },
];

const FundoInvestimentos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span><span>Tesouraria</span>
          <span>{">"}</span><span>Parametrização</span>
          <span>{">"}</span><span className="text-brand font-medium">Fundo Investimentos</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">Consulta do Fundo de Investimentos</h2>

        <div className="flex items-center gap-4 mb-6">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-60 rounded-full"><SelectValue placeholder="Selecione um filtro:" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">Consultar</Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500 inline-block" /> ATIVO</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500 inline-block" /> INATIVO</span>
          </div>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">Novo Fundo Investimento</Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-dark">
                <TableHead className="text-brand-foreground w-12" />
                <TableHead className="text-brand-foreground font-bold">Fundo de Investimento</TableHead>
                <TableHead className="text-brand-foreground font-bold">Operador</TableHead>
                <TableHead className="text-brand-foreground font-bold">Período de Vigência</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell><span className={`h-3 w-3 rounded-full inline-block ${item.ativo ? "bg-green-500" : "bg-red-500"}`} /></TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.operador}</TableCell>
                  <TableCell>{item.vigencia}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/fundo-investimento/${item.id}/cotas`)}>
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Calendar className="h-4 w-4" />
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
          <Select defaultValue="10"><SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem></SelectContent></Select>
          <span>1 - 2 de 2</span>
        </div>
      </div>
    </div>
  );
};

export default FundoInvestimentos;

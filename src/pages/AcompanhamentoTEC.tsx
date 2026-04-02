import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText, Plus, Settings } from "lucide-react";

const tecsData = [
  { id: 1, tomador: "Empresa ABC Ltda", contrato: "CT-2024-001", status: "Ativo", dataEmissao: "15/03/2026", proxVencimento: "20/04/2026" },
  { id: 2, tomador: "João Silva ME", contrato: "CT-2024-015", status: "Rascunho", dataEmissao: "—", proxVencimento: "—" },
  { id: 3, tomador: "Indústria XYZ S/A", contrato: "CT-2023-042", status: "Aguardando GSUP1", dataEmissao: "—", proxVencimento: "—" },
  { id: 4, tomador: "Comércio Delta Ltda", contrato: "CT-2023-088", status: "TEC gerado", dataEmissao: "10/03/2026", proxVencimento: "—" },
  { id: 5, tomador: "Transportes Omega", contrato: "CT-2022-120", status: "Encerrado", dataEmissao: "01/01/2025", proxVencimento: "—" },
];

const statusColors: Record<string, string> = {
  "Rascunho": "bg-gray-100 text-gray-700",
  "Aguardando GSUP1": "bg-yellow-100 text-yellow-800",
  "TEC gerado": "bg-blue-100 text-blue-800",
  "Ativo": "bg-green-100 text-green-800",
  "Encerrado": "bg-red-100 text-red-700",
};

const AcompanhamentoTEC = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTexto, setFiltroTexto] = useState("");

  const filtered = tecsData.filter(t => {
    if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
    if (filtroTexto && !t.tomador.toLowerCase().includes(filtroTexto.toLowerCase()) && !t.contrato.toLowerCase().includes(filtroTexto.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Acompanhamento de TECs</h2>
            <p className="text-sm text-muted-foreground">Visão consolidada de todos os Termos de Encerramento Condicionado</p>
          </div>
          <Button onClick={() => navigate("/emissao-tec")}>
            <Plus className="h-4 w-4 mr-1" /> Novo TEC
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
                <SelectItem value="Aguardando GSUP1">Aguardando GSUP1</SelectItem>
                <SelectItem value="TEC gerado">TEC gerado</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tomador / Contrato</label>
            <Input placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} className="w-64" />
          </div>
        </div>

        {/* Resumo por status */}
        <div className="flex gap-3">
          {Object.entries(statusColors).map(([status, cls]) => {
            const count = tecsData.filter(t => t.status === status).length;
            return (
              <button key={status} onClick={() => setFiltroStatus(status === filtroStatus ? "todos" : status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${filtroStatus === status ? "ring-2 ring-offset-1 ring-primary" : ""} ${cls}`}>
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Tomador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Próx. Vencimento</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tec => (
                <TableRow key={tec.id}>
                  <TableCell className="font-medium">{tec.contrato}</TableCell>
                  <TableCell>{tec.tomador}</TableCell>
                  <TableCell><Badge className={statusColors[tec.status]}>{tec.status}</Badge></TableCell>
                  <TableCell>{tec.dataEmissao}</TableCell>
                  <TableCell>{tec.proxVencimento}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/emissao-tec/${tec.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {tec.status === "Ativo" && (
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/gerenciar-tec/${tec.id}`)} title="Gerenciar Fluxo">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum TEC encontrado</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AcompanhamentoTEC;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Plus, Settings, Gavel } from "lucide-react";

const tecsData = [
  { id: 1, tomador: "Empresa ABC Ltda", contrato: "CT-2024-001", status: "Em andamento", dataEmissao: "15/03/2026", proxVencimento: "20/04/2026" },
  { id: 2, tomador: "João Silva ME", contrato: "CT-2024-015", status: "Rascunho", dataEmissao: "—", proxVencimento: "—" },
  { id: 3, tomador: "Indústria XYZ S/A", contrato: "CT-2023-042", status: "Em formalização", dataEmissao: "—", proxVencimento: "—" },
  { id: 4, tomador: "Comércio Delta Ltda", contrato: "CT-2023-088", status: "TEC emitido", dataEmissao: "10/03/2026", proxVencimento: "20/04/2026" },
  { id: 5, tomador: "Transportes Omega", contrato: "CT-2022-120", status: "Encerrado", dataEmissao: "01/01/2025", proxVencimento: "—" },
  { id: 6, tomador: "Construtora Beta", contrato: "CT-2024-077", status: "Suspenso", dataEmissao: "05/02/2026", proxVencimento: "—" },
];

const statusColors: Record<string, string> = {
  "Rascunho": "bg-gray-100 text-gray-700",
  "Em formalização": "bg-amber-100 text-amber-800",
  "TEC emitido": "bg-blue-100 text-blue-800",
  "Em andamento": "bg-emerald-100 text-emerald-800",
  "Suspenso": "bg-orange-100 text-orange-800",
  "Encerrado": "bg-slate-200 text-slate-700",
};

const AcompanhamentoTEC = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");

  const parseBR = (s: string): Date | null => {
    if (!s || s === "—") return null;
    const [d, m, y] = s.split("/").map(Number);
    return new Date(y, m - 1, d);
  };

  const filtered = tecsData.filter(t => {
    if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
    if (filtroTexto && !t.tomador.toLowerCase().includes(filtroTexto.toLowerCase()) && !t.contrato.toLowerCase().includes(filtroTexto.toLowerCase())) return false;
    const emissao = parseBR(t.dataEmissao);
    if (dataDe && emissao && emissao < new Date(dataDe)) return false;
    if (dataAte && emissao && emissao > new Date(dataAte)) return false;
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
        <div className="flex gap-3 items-end flex-wrap">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
                <SelectItem value="Em formalização">Em formalização</SelectItem>
                <SelectItem value="TEC emitido">TEC emitido</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
                <SelectItem value="Encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tomador / Contrato</label>
            <Input placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} className="w-64" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Emissão de</label>
            <Input type="date" value={dataDe} onChange={e => setDataDe(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">até</label>
            <Input type="date" value={dataAte} onChange={e => setDataAte(e.target.value)} className="w-40" />
          </div>
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge className={statusColors[tec.status]}>{tec.status}</Badge>
                      {tec.status === "Suspenso" && <Gavel className="h-3.5 w-3.5 text-orange-600" aria-label="Judicializado" />}
                    </div>
                  </TableCell>
                  <TableCell>{tec.dataEmissao}</TableCell>
                  <TableCell>{tec.proxVencimento}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/emissao-tec/${tec.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {tec.status === "Em andamento" && (
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

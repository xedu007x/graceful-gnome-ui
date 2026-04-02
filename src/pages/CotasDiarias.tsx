import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const cotasIniciais = [
  { id: 1, data: "02/04/2026", valor: "R$ 1,0004207" },
];

const CotasDiarias = () => {
  const navigate = useNavigate();
  const { fundoId } = useParams();
  const [cotas, setCotas] = useState(cotasIniciais);
  const [buscando, setBuscando] = useState(false);

  const buscarCotaIntegracao = async () => {
    setBuscando(true);
    // Simula integração com o fundo
    setTimeout(() => {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const cotaExistente = cotas.find((c) => c.data === hoje);
      const novaCota = { id: cotas.length + 1, data: hoje, valor: `R$ ${(1 + Math.random() * 0.001).toFixed(7).replace(".", ",")}` };
      if (cotaExistente) {
        setCotas(cotas.map((c) => (c.data === hoje ? { ...c, valor: novaCota.valor } : c)));
        toast.success("Cota atualizada com sucesso!");
      } else {
        setCotas([novaCota, ...cotas]);
        toast.success("Nova cota importada com sucesso!");
      }
      setBuscando(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4 cursor-pointer" onClick={() => navigate("/")} />
          <span>{">"}</span><span>Tesouraria</span>
          <span>{">"}</span><span>Parametrização</span>
          <span>{">"}</span><span className="cursor-pointer hover:text-brand" onClick={() => navigate("/fundo-investimentos")}>Fundo Investimentos</span>
          <span>{">"}</span><span className="text-brand font-medium">Cotas Diárias</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">Consulta de Cotas Diárias</h2>

        <div className="mb-2 text-sm">
          <p>Sigla: <span className="font-bold text-brand">CT</span></p>
          <p>Período de Vigência: <span className="font-bold text-brand">01/04/2026</span></p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Select defaultValue="">
            <SelectTrigger className="w-60 rounded-full"><SelectValue placeholder="Selecione um filtro:" /></SelectTrigger>
            <SelectContent><SelectItem value="data">Data</SelectItem></SelectContent>
          </Select>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-8">Consultar</Button>
        </div>

        <div className="flex items-center justify-end gap-3 mb-4">
          <Button variant="outline" className="rounded-full px-6 border-brand text-brand" onClick={() => navigate("/fundo-investimentos")}>Voltar</Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6">Nova Cota</Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6" onClick={buscarCotaIntegracao} disabled={buscando}>
            <RefreshCw className={`h-4 w-4 mr-2 ${buscando ? "animate-spin" : ""}`} />
            {buscando ? "Buscando..." : "Buscar Cota via Integração"}
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-dark">
                <TableHead className="text-brand-foreground font-bold">Data</TableHead>
                <TableHead className="text-brand-foreground font-bold">Cotas (R$)</TableHead>
                <TableHead className="text-brand-foreground font-bold text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotas.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="text-brand">{item.data}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4 text-sm text-muted-foreground">
          <span>Itens por página</span>
          <Select defaultValue="10"><SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem></SelectContent></Select>
          <span>1 - {cotas.length} de {cotas.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CotasDiarias;

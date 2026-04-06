import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Home, Search, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { getCotas, addCota, type Cota } from "@/lib/cotasStore";

const CotasDiarias = () => {
  const navigate = useNavigate();
  const { fundoId } = useParams();
  const [cotas, setCotas] = useState<Cota[]>(getCotas);
  const [buscando, setBuscando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaData, setNovaData] = useState("");
  const [novoValor, setNovoValor] = useState("");

  const buscarCotaIntegracao = async () => {
    setBuscando(true);
    setTimeout(() => {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const valor = 1 + Math.random() * 0.001;
      const updated = addCota(hoje, parseFloat(valor.toFixed(7)));
      setCotas(updated);
      toast.success("Cota importada/atualizada com sucesso!");
      setBuscando(false);
    }, 1500);
  };

  const handleSalvarNovaCota = () => {
    if (!novaData || !novoValor) {
      toast.error("Preencha data e valor da cota.");
      return;
    }
    const [y, m, d] = novaData.split("-");
    const dataFormatada = `${d}/${m}/${y}`;
    const valor = parseFloat(novoValor);
    if (isNaN(valor) || valor <= 0) {
      toast.error("Valor inválido.");
      return;
    }
    const updated = addCota(dataFormatada, valor);
    setCotas(updated);
    toast.success("Cota salva com sucesso!");
    setModalAberto(false);
    setNovaData("");
    setNovoValor("");
  };

  const formatarValor = (v: number) => `R$ ${v.toFixed(7).replace(".", ",")}`;

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
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground rounded-full px-6" onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nova Cota
          </Button>
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
                  <TableCell>{formatarValor(item.valor)}</TableCell>
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

      {/* Modal Nova Cota */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Cota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Data <span className="text-destructive">*</span></Label>
              <Input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Cota (R$) <span className="text-destructive">*</span></Label>
              <Input type="number" step="0.0000001" placeholder="Ex: 1.0004207" value={novoValor} onChange={e => setNovoValor(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button className="bg-brand hover:bg-brand/90 text-brand-foreground" onClick={handleSalvarNovaCota}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CotasDiarias;

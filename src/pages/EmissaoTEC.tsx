import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contratosmock = [
  { id: "CT-2024-001", tomador: "Empresa ABC Ltda", cpfCnpj: "12.345.678/0001-90", valorDevedor: 150000, status: "Inadimplente" },
  { id: "CT-2024-015", tomador: "João Silva ME", cpfCnpj: "123.456.789-00", valorDevedor: 85000, status: "Inadimplente" },
  { id: "CT-2023-042", tomador: "Indústria XYZ S/A", cpfCnpj: "98.765.432/0001-10", valorDevedor: 320000, status: "Inadimplente" },
];

const EmissaoTEC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [contratoSelecionado, setContratoSelecionado] = useState<typeof contratosMatch[0] | null>(null);
  const [valorHistorico, setValorHistorico] = useState("");
  const [dataBase, setDataBase] = useState("");
  const [dataAtualizacao, setDataAtualizacao] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [status, setStatus] = useState("Rascunho");

  const contratosMatch = busca.length >= 2
    ? contratosmock.filter(c =>
        c.id.toLowerCase().includes(busca.toLowerCase()) ||
        c.tomador.toLowerCase().includes(busca.toLowerCase()) ||
        c.cpfCnpj.includes(busca)
      )
    : [];

  // Simulated calculations
  const cotaDataBase = 3.456789; // simulated
  const cotaDataAtualizacao = 3.612345; // simulated
  const qtdTotalCotas = valorHistorico ? (parseFloat(valorHistorico) / cotaDataBase) : 0;
  const valorCorrigido = qtdTotalCotas * cotaDataAtualizacao;
  const qtdCotasMensais = numParcelas ? qtdTotalCotas / parseInt(numParcelas) : 0;

  const handleSalvar = () => {
    setStatus("Rascunho");
    toast({ title: "TEC salvo como rascunho", description: "Você pode editar e solicitar emissão posteriormente." });
  };

  const handleSolicitarEmissao = () => {
    setStatus("Aguardando emissão GSUP1");
    toast({ title: "Emissão solicitada", description: "E-mail enviado ao GSUP1. Campos bloqueados até análise." });
  };

  const statusColor: Record<string, string> = {
    "Rascunho": "bg-gray-100 text-gray-700",
    "Aguardando emissão GSUP1": "bg-yellow-100 text-yellow-800",
    "TEC gerado": "bg-blue-100 text-blue-800",
    "Ativo": "bg-green-100 text-green-800",
    "Encerrado": "bg-red-100 text-red-700",
  };

  const bloqueado = status !== "Rascunho";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Emissão de TEC</h2>
            <p className="text-sm text-muted-foreground">Termo de Encerramento Condicionado</p>
          </div>
          <Badge className={statusColor[status] || ""}>{status}</Badge>
        </div>

        {/* Busca de contrato */}
        {!contratoSelecionado && (
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">Buscar Contrato</h3>
            <div className="flex gap-2">
              <Input placeholder="Nº contrato, tomador ou CPF/CNPJ" value={busca} onChange={e => setBusca(e.target.value)} className="max-w-md" />
              <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
            </div>
            {contratosMatch.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Tomador</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Valor Devedor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratosMatch.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.id}</TableCell>
                      <TableCell>{c.tomador}</TableCell>
                      <TableCell>{c.cpfCnpj}</TableCell>
                      <TableCell>{c.valorDevedor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => setContratoSelecionado(c)}>Selecionar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Dados do contrato selecionado + formulário */}
        {contratoSelecionado && (
          <>
            <div className="bg-muted/30 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Contrato Selecionado</h3>
                {!bloqueado && <Button variant="ghost" size="sm" onClick={() => setContratoSelecionado(null)}>Alterar</Button>}
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground">Contrato:</span> <strong>{contratoSelecionado.id}</strong></div>
                <div><span className="text-muted-foreground">Tomador:</span> <strong>{contratoSelecionado.tomador}</strong></div>
                <div><span className="text-muted-foreground">CPF/CNPJ:</span> <strong>{contratoSelecionado.cpfCnpj}</strong></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="destructive">{contratoSelecionado.status}</Badge></div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-sm">Dados do TEC</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Campos manuais */}
                <div className="space-y-1">
                  <Label className="text-xs">Valor histórico a devolver (R$) <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input type="number" value={valorHistorico} onChange={e => setValorHistorico(e.target.value)} disabled={bloqueado} placeholder="0,00" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Data base <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input type="date" value={dataBase} onChange={e => setDataBase(e.target.value)} disabled={bloqueado} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Qtde total de cotas <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={qtdTotalCotas ? qtdTotalCotas.toFixed(6) : ""} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Data da atualização <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input type="date" value={dataAtualizacao} onChange={e => setDataAtualizacao(e.target.value)} disabled={bloqueado} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Valor corrigido a devolver <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={valorCorrigido ? valorCorrigido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : ""} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fonte da cota <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value="CVM" disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº de parcelas mensais <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input type="number" value={numParcelas} onChange={e => setNumParcelas(e.target.value)} disabled={bloqueado} placeholder="Ex: 12" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Qtde de cotas mensais <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={qtdCotasMensais ? qtdCotasMensais.toFixed(6) : ""} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dia de vencimento <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Select value={diaVencimento} onValueChange={setDiaVencimento} disabled={bloqueado}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => navigate("/acompanhamento-tec")}>Cancelar</Button>
                <Button onClick={handleSalvar} disabled={bloqueado}><Save className="h-4 w-4 mr-1" /> Salvar Rascunho</Button>
                <Button onClick={handleSolicitarEmissao} disabled={bloqueado} className="bg-amber-600 hover:bg-amber-700">
                  <Send className="h-4 w-4 mr-1" /> Solicitar Emissão de TEC
                </Button>
                {status === "Aguardando emissão GSUP1" && (
                  <>
                    <Button onClick={() => { setStatus("TEC gerado"); toast({ title: "TEC gerado", description: "Documento disponível para download em RTF e PDF." }); }} className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-1" /> Gerar TEC (GSUP1)
                    </Button>
                  </>
                )}
                {status === "TEC gerado" && (
                  <Button onClick={() => { setStatus("Ativo"); toast({ title: "TEC Finalizado", description: "Fluxo de pagamentos criado. E-mail enviado ao GSUP2." }); }} className="bg-green-600 hover:bg-green-700">
                    Finalizar TEC
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EmissaoTEC;

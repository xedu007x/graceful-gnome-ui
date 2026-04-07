import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Save, Send, FileText, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCotaMaisRecente, getCotaPorData, getCotas } from "@/lib/cotasStore";

const contratosmock = [
  { id: "CT-2024-001", tomador: "Empresa ABC Ltda", cpfCnpj: "12.345.678/0001-90", valorDevedor: 150000, status: "Inadimplente" },
  { id: "CT-2024-015", tomador: "João Silva ME", cpfCnpj: "123.456.789-00", valorDevedor: 85000, status: "Inadimplente" },
  { id: "CT-2023-042", tomador: "Indústria XYZ S/A", cpfCnpj: "98.765.432/0001-10", valorDevedor: 320000, status: "Inadimplente" },
];

interface Parcela {
  numero: number;
  qtdCotas: number;
  vencimento: string;
  dataPagamento: string;
  dataComunicacao: string;
  valorPagar: string;
  dataCotaUtilizada: string;
  observacoes: string;
  calculado: boolean;
}

const EmissaoTEC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [contratoSelecionado, setContratoSelecionado] = useState<typeof contratosmock[0] | null>(null);
  const [valorHistorico, setValorHistorico] = useState("");
  const [dataBase, setDataBase] = useState("");
  const [dataAtualizacao, setDataAtualizacao] = useState("");
  const [numParcelas, setNumParcelas] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [status, setStatus] = useState("Rascunho");
  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  const contratosMatch = busca.length >= 2
    ? contratosmock.filter(c =>
        c.id.toLowerCase().includes(busca.toLowerCase()) ||
        c.tomador.toLowerCase().includes(busca.toLowerCase()) ||
        c.cpfCnpj.includes(busca)
      )
    : [];

  // Busca cota pela data base no store de cotas diárias
  const getCotaValorPorData = (dataISO: string): { valor: number; fonte: string } | null => {
    if (!dataISO) return null;
    const [y, m, d] = dataISO.split("-");
    const dataFormatada = `${d}/${m}/${y}`;
    const cota = getCotaPorData(dataFormatada);
    if (cota) return { valor: cota.valor, fonte: "BB RF CP Automático - CNPJ: 42.592.315/0001-15" };
    // Fallback: cota mais recente
    const recente = getCotaMaisRecente();
    if (recente) return { valor: recente.valor, fonte: `BB RF CP Automático (${recente.data})` };
    return null;
  };

  const cotaBase = getCotaValorPorData(dataBase);
  const cotaAtual = getCotaValorPorData(dataAtualizacao);
  const cotaDataBaseVal = cotaBase?.valor || 0;
  const cotaDataAtualizacaoVal = cotaAtual?.valor || 0;
  const fonteCota = cotaBase?.fonte || "Sem dados";

  const qtdTotalCotas = valorHistorico && cotaDataBaseVal ? (parseFloat(valorHistorico) / cotaDataBaseVal) : 0;
  const valorCorrigido = qtdTotalCotas * cotaDataAtualizacaoVal;
  const qtdCotasMensais = numParcelas ? qtdTotalCotas / parseInt(numParcelas) : 0;

  const gerarParcelas = (num: string) => {
    setNumParcelas(num);
    // Parcelas só são geradas ao clicar em "Gerar TEC"
  };

  const gerarGridParcelas = () => {
    const n = parseInt(numParcelas);
    if (!n || n <= 0 || !qtdTotalCotas) {
      toast({ title: "Erro", description: "Preencha o valor histórico, data base e número de parcelas antes de gerar.", variant: "destructive" });
      return;
    }
    const dia = diaVencimento ? parseInt(diaVencimento) : 20;
    const cotasMensais = qtdTotalCotas / n;
    const hoje = new Date();
    setParcelas(
      Array.from({ length: n }, (_, i) => {
        const mesVenc = new Date(hoje.getFullYear(), hoje.getMonth() + 1 + i, 1);
        const diaReal = Math.min(dia, new Date(mesVenc.getFullYear(), mesVenc.getMonth() + 1, 0).getDate());
        return {
          numero: i + 1,
          qtdCotas: cotasMensais,
          vencimento: `${String(diaReal).padStart(2, "0")}/${String(mesVenc.getMonth() + 1).padStart(2, "0")}/${mesVenc.getFullYear()}`,
          dataPagamento: "",
          dataComunicacao: "",
          valorPagar: "",
          dataCotaUtilizada: "",
          observacoes: "",
          calculado: false,
        };
      })
    );
    toast({ title: "Parcelas geradas", description: `${n} parcelas criadas com sucesso.` });
  };

  const calcularParcela = (idx: number) => {
    const recente = getCotaMaisRecente();
    if (!recente) {
      toast({ title: "Erro", description: "Nenhuma cota cadastrada no Fundo de Investimentos.", variant: "destructive" });
      return;
    }
    const updated = [...parcelas];
    updated[idx] = {
      ...updated[idx],
      valorPagar: (updated[idx].qtdCotas * recente.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      dataCotaUtilizada: recente.data,
      calculado: true,
    };
    setParcelas(updated);
    toast({ title: "Parcela calculada", description: `Valor atualizado com cota de ${recente.data} (fonte: Fundo Investimentos)` });
  };

  const updateParcela = (idx: number, field: keyof Parcela, value: string) => {
    const updated = [...parcelas];
    updated[idx] = { ...updated[idx], [field]: value };
    setParcelas(updated);
  };

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
  const cotasDisponiveis = getCotas();

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground">Contrato:</span> <strong>{contratoSelecionado.id}</strong></div>
                <div><span className="text-muted-foreground">Tomador:</span> <strong>{contratoSelecionado.tomador}</strong></div>
                <div><span className="text-muted-foreground">CPF/CNPJ:</span> <strong>{contratoSelecionado.cpfCnpj}</strong></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="destructive">{contratoSelecionado.status}</Badge></div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Dados do TEC</h3>
                {cotasDisponiveis.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {cotasDisponiveis.length} cota(s) disponível(is) no Fundo de Investimentos
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Input value={fonteCota} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº de parcelas mensais <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input type="number" value={numParcelas} onChange={e => gerarParcelas(e.target.value)} disabled={bloqueado} placeholder="Ex: 12" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Qtde de cotas mensais <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={qtdCotasMensais ? qtdCotasMensais.toFixed(6) : ""} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dia de vencimento <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Select value={diaVencimento} onValueChange={v => { setDiaVencimento(v); if (numParcelas) gerarParcelas(numParcelas); }} disabled={bloqueado}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Fluxo de parcelas inline */}
            {parcelas.length > 0 && (
              <div className="bg-card border rounded-lg overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Fluxo de Parcelas ({parcelas.length})</h3>
                  <Button size="sm" variant="outline" onClick={() => parcelas.forEach((_, idx) => calcularParcela(idx))} disabled={bloqueado && status !== "Ativo"}>
                    <Calculator className="h-3 w-3 mr-1" /> Calcular Todas
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Nº</TableHead>
                        <TableHead className="bg-yellow-50">Qtd Cotas</TableHead>
                        <TableHead className="bg-yellow-50">Vencimento</TableHead>
                        <TableHead className="bg-blue-50">Data Pgto</TableHead>
                        <TableHead className="bg-blue-50">Data Comunicação</TableHead>
                        <TableHead>Valor a Pagar</TableHead>
                        <TableHead>Data Cota</TableHead>
                        <TableHead className="bg-blue-50">Observações</TableHead>
                        <TableHead className="w-24">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelas.map((p, idx) => (
                        <TableRow key={p.numero}>
                          <TableCell className="text-center font-medium">{p.numero}</TableCell>
                          <TableCell className="bg-yellow-50/50">{p.qtdCotas.toFixed(6)}</TableCell>
                          <TableCell className="bg-yellow-50/50">{p.vencimento}</TableCell>
                          <TableCell className="bg-blue-50/50">
                            <Input type="date" value={p.dataPagamento} onChange={e => updateParcela(idx, "dataPagamento", e.target.value)} className="h-8 text-xs" />
                          </TableCell>
                          <TableCell className="bg-blue-50/50">
                            <Input type="date" value={p.dataComunicacao} onChange={e => updateParcela(idx, "dataComunicacao", e.target.value)} className="h-8 text-xs" />
                          </TableCell>
                          <TableCell className={p.calculado ? "text-green-700 font-medium" : "text-muted-foreground"}>
                            {p.valorPagar || "—"}
                          </TableCell>
                          <TableCell className="text-xs">{p.dataCotaUtilizada || "—"}</TableCell>
                          <TableCell className="bg-blue-50/50">
                            <Input value={p.observacoes} onChange={e => updateParcela(idx, "observacoes", e.target.value)} className="h-8 text-xs" placeholder="..." />
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => calcularParcela(idx)} className="h-7 text-xs">
                              <Calculator className="h-3 w-3 mr-1" /> Calc
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/acompanhamento-tec")}>Cancelar</Button>
              <Button onClick={handleSalvar} disabled={bloqueado}><Save className="h-4 w-4 mr-1" /> Salvar Rascunho</Button>
              <Button onClick={handleSolicitarEmissao} disabled={bloqueado} className="bg-amber-600 hover:bg-amber-700">
                <Send className="h-4 w-4 mr-1" /> Solicitar Emissão de TEC
              </Button>
              {status === "Aguardando emissão GSUP1" && (
                <Button onClick={() => { gerarGridParcelas(); setStatus("TEC gerado"); toast({ title: "TEC gerado", description: "Parcelas geradas e documento disponível para download em RTF e PDF." }); }} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-1" /> Gerar TEC (GSUP1)
                </Button>
              )}
              {status === "TEC gerado" && (
                <Button onClick={() => { setStatus("Ativo"); toast({ title: "TEC Finalizado", description: "Fluxo de pagamentos criado. E-mail enviado ao GSUP2." }); }} className="bg-green-600 hover:bg-green-700">
                  Finalizar TEC
                </Button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EmissaoTEC;

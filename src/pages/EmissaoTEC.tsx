import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Save, Send, FileText, Calculator, Download, Eraser, PauseCircle, History, AlertTriangle, Gavel, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCotaMaisRecente, getCotaPorData, getCotas } from "@/lib/cotasStore";
import { getValorUfespAtual } from "@/lib/ufespStore";
import { getMaxParcelasPorUfesps, getFaixaUfespsLabel } from "@/lib/parcelasValidation";

const contratosmock = [
  { id: "CT-2024-001", tomador: "Empresa ABC Ltda", cpfCnpj: "12.345.678/0001-90", valorDevedor: 150000, status: "Inadimplente" },
  { id: "CT-2024-015", tomador: "João Silva ME", cpfCnpj: "123.456.789-00", valorDevedor: 85000, status: "Inadimplente" },
  { id: "CT-2023-042", tomador: "Indústria XYZ S/A", cpfCnpj: "98.765.432/0001-10", valorDevedor: 320000, status: "Inadimplente" },
];

interface Parcela {
  numero: number;
  qtdCotas: number;
  vencimento: string;
  cotacao: number;
  dataCotacao: string;
  valorRS: number;
  preenchimentoSigam: string;
  dataPgto: string;
  valorPago: number;
  comunicadoSigam: string;
  observacoes: string;
  calculado: boolean;
  historico: HistoricoEntry[];
}

interface HistoricoEntry {
  data: string;
  responsavel: string;
  acao: string;
  detalhes?: string;
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
  const [status, setStatus] = useState("Rascunho");
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [motivoSuspensao, setMotivoSuspensao] = useState("");
  const [motivoSuspensaoInput, setMotivoSuspensaoInput] = useState("");
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [contemAnexos, setContemAnexos] = useState(false);
  const [textoAnexo, setTextoAnexo] = useState("");
  const [historicoTec, setHistoricoTec] = useState<HistoricoEntry[]>([]);
  const [dataEmissao, setDataEmissao] = useState<string>("");
  const [historicoParcelaIdx, setHistoricoParcelaIdx] = useState<number | null>(null);

  const usuarioAtual = "GESUP2 (você)";
  const hoje = new Date();

  const contratosMatch = busca.length >= 2
    ? contratosmock.filter(c =>
        c.id.toLowerCase().includes(busca.toLowerCase()) ||
        c.tomador.toLowerCase().includes(busca.toLowerCase()) ||
        c.cpfCnpj.includes(busca)
      )
    : [];

  const getCotaValorPorData = (dataISO: string): { valor: number; fonte: string } | null => {
    if (!dataISO) return null;
    const [y, m, d] = dataISO.split("-");
    const dataFormatada = `${d}/${m}/${y}`;
    const cota = getCotaPorData(dataFormatada);
    if (cota) return { valor: cota.valor, fonte: `CVM — BB RF CP Automático (${cota.data})` };
    const recente = getCotaMaisRecente();
    if (recente) return { valor: recente.valor, fonte: `Planilha TE — BB RF CP Automático (${recente.data})` };
    return null;
  };

  const cotaBase = getCotaValorPorData(dataBase);
  const cotaAtual = getCotaValorPorData(dataAtualizacao);
  const cotaDataBaseVal = cotaBase?.valor || 0;
  const cotaDataAtualizacaoVal = cotaAtual?.valor || 0;
  const fonteCota = cotaBase?.fonte || "Sem dados";

  const valorHistoricoNum = valorHistorico ? parseFloat(valorHistorico.replace(/\./g, "").replace(",", ".")) : 0;
  const qtdTotalCotas = valorHistoricoNum && cotaDataBaseVal ? (valorHistoricoNum / cotaDataBaseVal) : 0;
  const valorCorrigido = qtdTotalCotas * cotaDataAtualizacaoVal;
  const valorUfesp = getValorUfespAtual();
  const qtdTotalUfesps = valorHistoricoNum && valorUfesp ? valorHistoricoNum / valorUfesp : 0;
  const maxParcelas = qtdTotalUfesps ? getMaxParcelasPorUfesps(qtdTotalUfesps) : 0;
  const numParcelasNum = numParcelas ? parseInt(numParcelas) : 0;
  const parcelasExcedeLimite = !!(qtdTotalUfesps && numParcelasNum && numParcelasNum > maxParcelas);
  const qtdCotasMensais = numParcelasNum ? qtdTotalCotas / numParcelasNum : 0;

  const gerarParcelas = (num: string) => {
    setNumParcelas(num);
  };

  const gerarGridParcelas = () => {
    const n = parseInt(numParcelas);
    if (!n || n <= 0 || !qtdTotalCotas) {
      toast({ title: "Erro", description: "Preencha o valor histórico, data base e número de parcelas antes de gerar.", variant: "destructive" });
      return;
    }
    if (parcelasExcedeLimite) {
      toast({ title: "Limite excedido", description: `Faixa ${getFaixaUfespsLabel(qtdTotalUfesps)}: máximo ${maxParcelas} parcelas.`, variant: "destructive" });
      return;
    }
    const dia = 20;
    const cotasMensais = qtdTotalCotas / n;
    const hojeRef = new Date();
    setParcelas(
      Array.from({ length: n }, (_, i) => {
        const mesVenc = new Date(hojeRef.getFullYear(), hojeRef.getMonth() + 1 + i, 1);
        const diaReal = Math.min(dia, new Date(mesVenc.getFullYear(), mesVenc.getMonth() + 1, 0).getDate());
        return {
          numero: i + 1,
          qtdCotas: cotasMensais,
          vencimento: `${String(diaReal).padStart(2, "0")}/${String(mesVenc.getMonth() + 1).padStart(2, "0")}/${mesVenc.getFullYear()}`,
          cotacao: 0,
          dataCotacao: "",
          valorRS: 0,
          preenchimentoSigam: "",
          dataPgto: "",
          valorPago: 0,
          comunicadoSigam: "",
          observacoes: "",
          calculado: false,
          historico: [],
        };
      })
    );
    const hojeStr = new Date().toLocaleString("pt-BR");
    setDataEmissao(hojeStr.split(" ")[0]);
    setHistoricoTec(h => [...h, { data: hojeStr, responsavel: "GESUP1", acao: "TEC gerado", detalhes: `${n} parcelas criadas` }]);
    toast({ title: "Parcelas geradas", description: `${n} parcelas criadas com sucesso.` });
  };

  const calcularParcela = (idx: number, recalculo: boolean = false) => {
    const recente = getCotaMaisRecente();
    if (!recente) {
      toast({ title: "Erro", description: "Nenhuma cota cadastrada no Fundo de Investimentos.", variant: "destructive" });
      return;
    }
    const updated = [...parcelas];
    const valorAnterior = updated[idx].valorRS;
    const valorCalc = updated[idx].qtdCotas * recente.valor;
    const novaEntrada: HistoricoEntry = {
      data: new Date().toLocaleString("pt-BR"),
      responsavel: recalculo ? "Cobrança" : usuarioAtual,
      acao: recalculo ? "Recálculo (parcela em atraso)" : "Cálculo da parcela",
      detalhes: `Cota ${recente.valor} (${recente.data}) · Valor ${valorAnterior ? `R$ ${valorAnterior.toFixed(2)} → ` : ""}R$ ${valorCalc.toFixed(2)}`,
    };
    updated[idx] = {
      ...updated[idx],
      cotacao: recente.valor,
      dataCotacao: recente.data,
      valorRS: valorCalc,
      calculado: true,
      historico: [...updated[idx].historico, novaEntrada],
    };
    setParcelas(updated);
    if (status === "TEC emitido" && !parcelas.some(p => p.calculado)) {
      setStatus("Em andamento");
    }
    toast({ title: "Parcela calculada", description: `Valor: ${valorCalc.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (cota: ${recente.valor} de ${recente.data})` });
  };

  const limparParcela = (idx: number) => {
    const updated = [...parcelas];
    updated[idx] = {
      ...updated[idx],
      cotacao: 0,
      dataCotacao: "",
      valorRS: 0,
      calculado: false,
      historico: [...updated[idx].historico, { data: new Date().toLocaleString("pt-BR"), responsavel: usuarioAtual, acao: "Parcela limpa para recálculo" }],
    };
    setParcelas(updated);
    toast({ title: "Parcela limpa", description: `Parcela ${idx + 1} foi resetada para recalcular.` });
  };

  const updateParcela = (idx: number, field: keyof Parcela, value: string) => {
    const updated = [...parcelas];
    const old = (updated[idx] as any)[field];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
      historico: [
        ...updated[idx].historico,
        { data: new Date().toLocaleString("pt-BR"), responsavel: usuarioAtual, acao: `Alteração: ${field}`, detalhes: `${old || "—"} → ${value || "—"}` },
      ],
    };
    setParcelas(updated);
  };

  const handleSalvar = () => {
    if (parcelasExcedeLimite) {
      toast({ title: "Não é possível salvar", description: `Limite de parcelas excedido para a faixa ${getFaixaUfespsLabel(qtdTotalUfesps)} (máx. ${maxParcelas}).`, variant: "destructive" });
      return;
    }
    setStatus("Rascunho");
    toast({ title: "TEC salvo", description: "Status: Rascunho. Você pode editar e solicitar emissão." });
  };

  const handleSolicitarEmissao = () => {
    if (parcelasExcedeLimite) {
      toast({ title: "Não é possível solicitar emissão", description: `Limite de parcelas excedido (máx. ${maxParcelas}).`, variant: "destructive" });
      return;
    }
    setStatus("Em formalização");
    toast({ title: "Emissão solicitada", description: "Status: Em formalização. Aguardando GESUP1." });
  };

  const handleSuspender = () => {
    if (!motivoSuspensaoInput.trim()) {
      toast({ title: "Erro", description: "Informe o motivo da suspensão.", variant: "destructive" });
      return;
    }
    setMotivoSuspensao(motivoSuspensaoInput.trim());
    setStatus("Suspenso");
    setShowSuspenderModal(false);
    setHistoricoTec(h => [...h, { data: new Date().toLocaleString("pt-BR"), responsavel: usuarioAtual, acao: "TEC Suspenso (judicializado)", detalhes: motivoSuspensaoInput.trim() }]);
    toast({ title: "TEC Suspenso", description: "O TEC foi suspenso com sucesso." });
  };

  const statusConfig: Record<string, { color: string; icon: string }> = {
    "Rascunho": { color: "bg-gray-200 text-gray-800 border-gray-300", icon: "📝" },
    "Em formalização": { color: "bg-amber-100 text-amber-800 border-amber-300", icon: "📋" },
    "TEC emitido": { color: "bg-blue-100 text-blue-800 border-blue-300", icon: "📄" },
    "Em andamento": { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "▶️" },
    "Em atraso": { color: "bg-red-100 text-red-800 border-red-300", icon: "⚠️" },
    "Suspenso": { color: "bg-orange-100 text-orange-800 border-orange-300", icon: "⏸️" },
    "Encerrado": { color: "bg-slate-200 text-slate-700 border-slate-400", icon: "✅" },
  };

  const bloqueado = status !== "Rascunho";
  const somenteLeitura = status === "Suspenso" || status === "Encerrado";
  const cotasDisponiveis = getCotas();

  const parseDataBR = (s: string): Date | null => {
    if (!s) return null;
    const [d, m, y] = s.split("/").map(Number);
    return new Date(y, m - 1, d);
  };
  const diasAtraso = (vencimento: string): number => {
    const v = parseDataBR(vencimento);
    if (!v) return 0;
    const diff = Math.floor((hoje.getTime() - v.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  const isCalcularAgora = (vencimento: string): boolean => {
    const v = parseDataBR(vencimento);
    if (!v) return false;
    const diff = Math.floor((v.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Emissão de TEC</h2>
            <p className="text-sm text-muted-foreground">Termo de Encerramento Condicionado</p>
          </div>
          <Badge className={`text-sm px-4 py-1.5 border font-semibold ${statusConfig[status]?.color || "bg-gray-100 text-gray-700"}`}>
            {statusConfig[status]?.icon} {status}
          </Badge>
        </div>

        {/* Motivo de suspensão em tela */}
        {status === "Suspenso" && motivoSuspensao && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 flex items-start gap-3">
            <Gavel className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-orange-800">TEC Suspenso</p>
                <Badge className="bg-orange-200 text-orange-900 border-orange-400 text-[10px]">Processo judicializado</Badge>
              </div>
              <p className="text-sm text-orange-700 mt-1"><strong>Motivo:</strong> {motivoSuspensao}</p>
              <p className="text-xs text-orange-600 mt-1">TEC bloqueado para ações operacionais — disponível apenas para consulta.</p>
            </div>
          </div>
        )}

        {/* Botões de download */}
        {["TEC emitido", "Em andamento", "Em atraso", "Suspenso", "Encerrado"].includes(status) && (
          <div className="flex gap-3">
            <Button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6">
              <Download className="h-4 w-4 mr-2" />
              Baixar Termo em PDF
            </Button>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6">
              <Download className="h-4 w-4 mr-2" />
              Baixar Termo em Word
            </Button>
          </div>
        )}

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
                <div><span className="text-muted-foreground">Valor Devedor:</span> <strong>{contratoSelecionado.valorDevedor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
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
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={valorHistorico}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      if (!raw) { setValorHistorico(""); return; }
                      const num = (parseInt(raw) / 100).toFixed(2);
                      const [intPart, decPart] = num.split(".");
                      const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + decPart;
                      setValorHistorico(formatted);
                    }}
                    disabled={bloqueado}
                    placeholder="0,00"
                  />
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
                  <Label className="text-xs">Qtde total de UFESPs <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={qtdTotalUfesps ? qtdTotalUfesps.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : ""} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fonte da cota <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={fonteCota} disabled className="bg-green-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nº de parcelas mensais <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Input
                    type="number"
                    value={numParcelas}
                    onChange={e => gerarParcelas(e.target.value)}
                    disabled={bloqueado}
                    placeholder="Ex: 12"
                    className={parcelasExcedeLimite ? "border-destructive" : ""}
                  />
                  {qtdTotalUfesps > 0 && (
                    <p className={`text-[10px] ${parcelasExcedeLimite ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      Faixa {getFaixaUfespsLabel(qtdTotalUfesps)} · máx. {maxParcelas} parcelas
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Qtde de cotas mensais <span className="text-green-600 text-[10px]">AUTO</span></Label>
                  <Input value={qtdCotasMensais ? qtdCotasMensais.toFixed(6) : ""} disabled className="bg-green-50" />
                </div>
                <div className="flex items-center space-x-2 self-end pb-1">
                  <Checkbox
                    id="contemAnexos"
                    checked={contemAnexos}
                    onCheckedChange={(checked) => setContemAnexos(checked === true)}
                    disabled={status === "Rascunho"}
                  />
                  <Label htmlFor="contemAnexos" className="text-xs font-medium cursor-pointer">Contém Anexos?</Label>
                </div>
              </div>
              {parcelasExcedeLimite && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">
                    Limite de parcelas excedido com base na quantidade de UFESPs ({qtdTotalUfesps.toFixed(0)} UFESPs — máx. {maxParcelas}).
                    Ajuste o número de parcelas para prosseguir.
                  </p>
                </div>
              )}
              {contemAnexos && (
                <div className="space-y-1 mt-2">
                  <Label className="text-xs">Texto do Anexo (será impresso no termo) <span className="text-blue-500 text-[10px]">MANUAL</span></Label>
                  <Textarea
                    value={textoAnexo}
                    onChange={e => setTextoAnexo(e.target.value)}
                    disabled={status === "Rascunho"}
                    placeholder="Insira o texto da cláusula referente aos anexos..."
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Fluxo de parcelas inline */}
            {parcelas.length > 0 && (
              <div className="bg-card border rounded-lg overflow-hidden">
                {/* Cabeçalho fixo do TEC ativo (CA 09) */}
                <div className="bg-muted/40 border-b px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Tomador:</span> <strong>{contratoSelecionado.tomador}</strong></div>
                  <div><span className="text-muted-foreground">Contrato:</span> <strong>{contratoSelecionado.id}</strong></div>
                  <div><span className="text-muted-foreground">Valor da parcela (cotas):</span> <strong>{qtdCotasMensais.toFixed(6)}</strong></div>
                  <div><span className="text-muted-foreground">Data de emissão:</span> <strong>{dataEmissao || "—"}</strong></div>
                </div>
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Fluxo de Parcelas ({parcelas.length})</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vencimento: todo dia 20 · Devolução mensal em cotas: <strong>{qtdCotasMensais.toFixed(2)}</strong> · Qtd total cotas: <strong>{qtdTotalCotas.toFixed(2)}</strong>
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => parcelas.forEach((_, idx) => calcularParcela(idx))} disabled={somenteLeitura}>
                    <Calculator className="h-3 w-3 mr-1" /> Calcular Todas
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Parcela</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cotação</TableHead>
                        <TableHead>Data da cotação</TableHead>
                        <TableHead>Valor R$</TableHead>
                        <TableHead>Preenchimento Sigam</TableHead>
                        <TableHead>Data Pgto</TableHead>
                        <TableHead>Valor Pago</TableHead>
                        <TableHead>Comunicado SIGAM</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead className="w-32">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelas.map((p, idx) => {
                        const atraso = diasAtraso(p.vencimento);
                        const emAtraso = atraso > 0 && !p.dataPgto;
                        const podeRecalcular = emAtraso && atraso > 3;
                        const calcularAgora = isCalcularAgora(p.vencimento) && !p.calculado && !p.dataPgto;
                        return (
                        <TableRow key={p.numero} className={emAtraso ? "bg-red-50/60" : ""}>
                          <TableCell className="text-center font-medium">{p.numero}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {p.vencimento}
                              {emAtraso && <Badge className="bg-red-100 text-red-700 border-red-300 text-[9px] px-1 py-0">Em atraso</Badge>}
                              {calcularAgora && <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[9px] px-1 py-0">Calcular agora</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className={p.calculado ? "font-medium" : "text-muted-foreground"}>
                            {p.cotacao ? p.cotacao.toFixed(8) : "—"}
                          </TableCell>
                          <TableCell className="text-xs">{p.dataCotacao || "—"}</TableCell>
                          <TableCell className={p.calculado ? "font-medium" : "text-muted-foreground"}>
                            {p.valorRS ? p.valorRS.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "0"}
                          </TableCell>
                          <TableCell>
                            <Input type="date" value={p.preenchimentoSigam} onChange={e => updateParcela(idx, "preenchimentoSigam", e.target.value)} className="h-8 text-xs" disabled={somenteLeitura} />
                          </TableCell>
                          <TableCell>
                            <Input type="date" value={p.dataPgto} onChange={e => updateParcela(idx, "dataPgto", e.target.value)} className="h-8 text-xs" disabled={somenteLeitura} />
                          </TableCell>
                          <TableCell className={p.valorPago ? "font-medium" : "text-muted-foreground"}>
                            {p.valorPago ? p.valorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                          </TableCell>
                          <TableCell>
                            <Input type="date" value={p.comunicadoSigam} onChange={e => updateParcela(idx, "comunicadoSigam", e.target.value)} className="h-8 text-xs" disabled={somenteLeitura} />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={p.observacoes}
                              onChange={e => updateParcela(idx, "observacoes", e.target.value)}
                              className="h-8 text-xs min-w-[140px]"
                              placeholder="—"
                              disabled={somenteLeitura}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              <Button size="sm" variant="outline" onClick={() => calcularParcela(idx)} className="h-7 text-xs" disabled={somenteLeitura}>
                                <Calculator className="h-3 w-3 mr-1" /> Calc
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => limparParcela(idx)} className="h-7 text-xs text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400" title="Limpar para recalcular" disabled={somenteLeitura}>
                                <Eraser className="h-3 w-3" />
                              </Button>
                              {podeRecalcular && (
                                <Button size="sm" variant="outline" onClick={() => calcularParcela(idx, true)} className="h-7 text-xs text-red-600 hover:text-red-700 border-red-300" title="Recalcular (Cobrança)" disabled={somenteLeitura}>
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => setHistoricoParcelaIdx(idx)} className="h-7 text-xs" title="Histórico">
                                <History className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Histórico do TEC */}
            {historicoTec.length > 0 && (
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <History className="h-4 w-4" /> Histórico do TEC
                </h3>
                <div className="space-y-2 text-xs">
                  {historicoTec.map((h, i) => (
                    <div key={i} className="border-l-2 border-primary/40 pl-3 py-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{h.acao}</span>
                        <span className="text-muted-foreground">{h.data}</span>
                      </div>
                      <div className="text-muted-foreground">{h.responsavel}{h.detalhes ? ` · ${h.detalhes}` : ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/acompanhamento-tec")}>Cancelar</Button>
              <Button onClick={handleSalvar} disabled={bloqueado || parcelasExcedeLimite}><Save className="h-4 w-4 mr-1" /> Salvar Rascunho</Button>
              <Button onClick={handleSolicitarEmissao} disabled={bloqueado || parcelasExcedeLimite} className="bg-amber-600 hover:bg-amber-700 text-white">
                <Send className="h-4 w-4 mr-1" /> Solicitar Emissão de TEC
              </Button>
              {status === "Em formalização" && (
                <Button onClick={() => { gerarGridParcelas(); setStatus("TEC emitido"); toast({ title: "TEC gerado", description: "Parcelas geradas. Status: TEC emitido." }); }} disabled={parcelasExcedeLimite} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FileText className="h-4 w-4 mr-1" /> Gerar TEC (GSUP1)
                </Button>
              )}
              {(status === "Em andamento" || status === "TEC emitido") && (
                <Button onClick={() => { setMotivoSuspensaoInput(""); setShowSuspenderModal(true); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <PauseCircle className="h-4 w-4 mr-1" /> Suspender TEC
                </Button>
              )}
              {(status === "TEC emitido" || status === "Em andamento") && (
                <Button onClick={() => { 
                  const todasPagas = parcelas.length > 0 && parcelas.every(p => !!p.dataPgto);
                  if (todasPagas) {
                    setStatus("Encerrado"); 
                    setHistoricoTec(h => [...h, { data: new Date().toLocaleString("pt-BR"), responsavel: "GSUP1", acao: "TEC Encerrado", detalhes: "Todas as parcelas pagas" }]);
                    toast({ title: "TEC Encerrado", description: "Todas as parcelas pagas. Status: Encerrado." });
                  } else {
                    toast({ title: "Atenção", description: "Todas as parcelas precisam ter Data de Pagamento preenchida antes de finalizar.", variant: "destructive" });
                  }
                }} className="bg-green-600 hover:bg-green-700 text-white">
                  Finalizar TEC
                </Button>
              )}
            </div>
          </>
        )}

        {/* Modal Suspender TEC */}
        <Dialog open={showSuspenderModal} onOpenChange={setShowSuspenderModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PauseCircle className="h-5 w-5 text-orange-600" />
                Suspender TEC
              </DialogTitle>
              <DialogDescription>
                Informe o motivo da suspensão do Termo de Encerramento Condicionado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label className="text-sm font-medium">Motivo da Suspensão *</Label>
              <Textarea
                placeholder="Descreva o motivo da suspensão..."
                value={motivoSuspensaoInput}
                onChange={e => setMotivoSuspensaoInput(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSuspenderModal(false)}>Cancelar</Button>
              <Button onClick={handleSuspender} className="bg-orange-600 hover:bg-orange-700 text-white">
                Confirmar Suspensão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Histórico da Parcela */}
        <Dialog open={historicoParcelaIdx !== null} onOpenChange={(o) => !o && setHistoricoParcelaIdx(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico da Parcela {historicoParcelaIdx !== null ? historicoParcelaIdx + 1 : ""}
              </DialogTitle>
              <DialogDescription>Registro de todas as alterações desta parcela.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto py-2">
              {historicoParcelaIdx !== null && parcelas[historicoParcelaIdx]?.historico.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma alteração registrada.</p>
              )}
              {historicoParcelaIdx !== null && parcelas[historicoParcelaIdx]?.historico.map((h, i) => (
                <div key={i} className="border-l-2 border-primary/40 pl-3 py-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">{h.acao}</span>
                    <span className="text-muted-foreground">{h.data}</span>
                  </div>
                  <div className="text-muted-foreground">{h.responsavel}{h.detalhes ? ` · ${h.detalhes}` : ""}</div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoricoParcelaIdx(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default EmissaoTEC;

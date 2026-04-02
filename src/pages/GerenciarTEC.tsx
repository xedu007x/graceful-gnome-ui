import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const GerenciarTEC = () => {
  const { tecId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cabecalho = {
    tomador: "Empresa ABC Ltda",
    contrato: "CT-2024-001",
    valorParcelaCota: "12.500,123456",
    dataEmissao: "15/03/2026",
  };

  const [parcelas, setParcelas] = useState<Parcela[]>(
    Array.from({ length: 12 }, (_, i) => ({
      numero: i + 1,
      qtdCotas: 12500.123456,
      vencimento: `${String(20).padStart(2, "0")}/${String((4 + i) % 12 || 12).padStart(2, "0")}/2026`,
      dataPagamento: "",
      dataComunicacao: "",
      valorPagar: "",
      dataCotaUtilizada: "",
      observacoes: "",
      calculado: false,
    }))
  );

  const calcularParcela = (idx: number) => {
    const cotaAtual = 3.654321; // simulated
    const updated = [...parcelas];
    updated[idx] = {
      ...updated[idx],
      valorPagar: (updated[idx].qtdCotas * cotaAtual).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      dataCotaUtilizada: new Date().toLocaleDateString("pt-BR"),
      calculado: true,
    };
    setParcelas(updated);
    toast({ title: "Parcela calculada", description: `Valor atualizado com cota de ${new Date().toLocaleDateString("pt-BR")} (fonte: CVM)` });
  };

  const updateParcela = (idx: number, field: keyof Parcela, value: string) => {
    const updated = [...parcelas];
    updated[idx] = { ...updated[idx], [field]: value };
    setParcelas(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Gerenciar TEC</h2>
            <p className="text-sm text-muted-foreground">Fluxo de Pagamentos — TEC #{tecId}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/acompanhamento-tec")}>Voltar</Button>
        </div>

        {/* Cabeçalho fixo */}
        <div className="bg-muted/30 border rounded-lg p-4 grid grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Tomador:</span><br/><strong>{cabecalho.tomador}</strong></div>
          <div><span className="text-muted-foreground">Contrato:</span><br/><strong>{cabecalho.contrato}</strong></div>
          <div><span className="text-muted-foreground">Valor da Parcela (cotas):</span><br/><strong>{cabecalho.valorParcelaCota}</strong></div>
          <div><span className="text-muted-foreground">Data Emissão TEC:</span><br/><strong>{cabecalho.dataEmissao}</strong></div>
        </div>

        {/* Grid de parcelas */}
        <div className="bg-card border rounded-lg overflow-hidden">
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
                        <Calculator className="h-3 w-3 mr-1" /> Calcular
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => toast({ title: "Salvo", description: "Alterações gravadas com sucesso." })}>
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
          <Button variant="outline" onClick={() => {
            parcelas.forEach((_, idx) => calcularParcela(idx));
          }}>
            <Calculator className="h-4 w-4 mr-1" /> Calcular Todas as Parcelas
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GerenciarTEC;

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transacao {
  id: number;
  transacao: string;
  cliente: string;
  valor: number;
  bacia: string;
  status: string;
  dataImportacao: string;
}

const dadosIniciais: Transacao[] = [
  { id: 1, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 692318.21, bacia: "COB - CB- RB Ribeira do Iguape e Litoral Sul", status: "PENDENTE", dataImportacao: "05/03/2026" },
  { id: 2, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 234542.64, bacia: "COB - CB- SMG Sapucaí-Mirim / Grande", status: "PENDENTE", dataImportacao: "05/03/2026" },
  { id: 3, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 287099.35, bacia: "COB - CB- AT Alto Tietê", status: "PENDENTE", dataImportacao: "04/03/2026" },
  { id: 4, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 298409.08, bacia: "COB - CB- BPG Baixo Pardo / Grande", status: "PENDENTE", dataImportacao: "04/03/2026" },
  { id: 5, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 203154.14, bacia: "COB - CB- BT Baixo Tietê", status: "PENDENTE", dataImportacao: "03/03/2026" },
  { id: 6, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 183845.06, bacia: "COB - CB- PARDO Pardo", status: "PENDENTE", dataImportacao: "03/03/2026" },
  { id: 7, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 1032894.76, bacia: "COB - CB- TJ Tietê-Jacaré", status: "PENDENTE", dataImportacao: "02/03/2026" },
  { id: 8, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 348533.42, bacia: "COB - CB- AP Aquapeí e Peixe", status: "PENDENTE", dataImportacao: "02/03/2026" },
  { id: 9, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 414418.87, bacia: "COB - CB- TG Turvo / Grande", status: "PENDENTE", dataImportacao: "01/03/2026" },
  { id: 10, transacao: "RECEBIMENTO DE BOLETOS COBRANÇA", cliente: "Banco do Brasil S.A.", valor: 460810.88, bacia: "COB - CB- PS Paraíba do Sul", status: "PENDENTE", dataImportacao: "01/03/2026" },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CnabRecebimentos = () => {
  const [dados, setDados] = useState<Transacao[]>(dadosIniciais);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === dados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(dados.map((d) => d.id)));
    }
  };

  const excluirPendentes = () => {
    setDados((prev) => prev.filter((d) => d.status !== "PENDENTE"));
    setSelectedIds(new Set());
  };

  const valorTotalSelecionado = useMemo(
    () => dados.filter((d) => selectedIds.has(d.id)).reduce((sum, d) => sum + d.valor, 0),
    [selectedIds, dados]
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Home className="h-4 w-4" />
          <span>&gt;</span>
          <span>Gerar Contas a Receber</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-6">CNAB Recebimentos</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">PENDENTE</SelectItem>
              <SelectItem value="processado">PROCESSADO</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="pendente">
            <SelectTrigger className="w-48 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">PENDENTE</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-brand text-brand-foreground hover:bg-brand/90 px-6">
            Consultar
          </Button>
          <Button variant="outline" className="px-6">Importar</Button>
          <Button variant="outline" className="px-6">Enviar todas</Button>
          <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6" onClick={excluirPendentes}>
            Excluir Importação
          </Button>
        </div>

        {/* Summary - aligned left */}
        <div className="flex flex-col items-start gap-1 mb-4">
          <p className="text-sm text-muted-foreground">
            Total selecionados: <span className="font-semibold text-foreground">{selectedIds.size}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Valor Total Selecionado:{" "}
            <span className="font-bold text-foreground text-base">
              {formatCurrency(valorTotalSelecionado)}
            </span>
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-dark hover:bg-brand-dark">
                <TableHead className="w-12 text-brand-foreground">
                  <Checkbox
                    checked={dados.length > 0 && selectedIds.size === dados.length}
                    onCheckedChange={toggleAll}
                    className="border-brand-foreground/50 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                  />
                </TableHead>
                <TableHead className="text-brand-foreground font-semibold">Transação</TableHead>
                <TableHead className="text-brand-foreground font-semibold">Data da Importação</TableHead>
                <TableHead className="text-brand-foreground font-semibold">Cliente</TableHead>
                <TableHead className="text-brand-foreground font-semibold">Valor (R$)</TableHead>
                <TableHead className="text-brand-foreground font-semibold">Bacia</TableHead>
                <TableHead className="text-brand-foreground font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <TableRow
                    key={row.id}
                    className={isSelected ? "bg-brand/5" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(row.id)}
                        className={isSelected ? "border-brand data-[state=checked]:bg-brand data-[state=checked]:border-brand" : ""}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">{row.transacao}</TableCell>
                    <TableCell className="text-sm">{row.dataImportacao}</TableCell>
                    <TableCell className="text-sm">{row.cliente}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(row.valor)}</TableCell>
                    <TableCell className="text-sm">{row.bacia}</TableCell>
                    <TableCell>
                      <span className="font-bold text-warning">{row.status}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Itens por página</span>
            <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
              <SelectTrigger className="w-20 h-8 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span>1 - 10 de 165</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CnabRecebimentos;

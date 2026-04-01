import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-brand-dark">
      <div className="container flex items-center justify-between py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-10 w-10 rounded bg-brand flex items-center justify-center">
            <span className="text-brand-foreground font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="text-brand-foreground font-bold text-sm leading-tight">DESENVOLVE SP</h1>
            <p className="text-brand-foreground/70 text-[10px]">A AGÊNCIA DO EMPREENDEDOR</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded border border-brand-foreground/30 px-3 py-1.5">
            <span className="text-brand-foreground text-sm">FEHIDRO</span>
            <ChevronDown className="h-4 w-4 text-brand-foreground" />
          </div>
        </div>
      </div>
      <nav className="container flex items-center gap-6 pb-2">
        <button
          onClick={() => navigate("/")}
          className={`text-sm transition-colors ${isActive("/") ? "text-brand-foreground font-semibold" : "text-brand-foreground/90 hover:text-brand-foreground"}`}
        >
          Início
        </button>
        <button
          onClick={() => navigate("/contratos")}
          className={`text-sm transition-colors ${isActive("/contratos") || location.pathname.startsWith("/contrato/") ? "text-brand-foreground font-semibold" : "text-brand-foreground/90 hover:text-brand-foreground"}`}
        >
          Contrato
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`text-sm transition-colors ${isActive("/oficios") ? "text-brand-foreground font-semibold" : "text-brand-foreground/90 hover:text-brand-foreground"}`}>
              Ofícios <ChevronDown className="inline h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/oficios")}>Gerenciar Ofício/Parcelas</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Contas BB</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Contas BB</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>Aprovar em Lote</DropdownMenuItem>
            <DropdownMenuItem>Emitir termos</DropdownMenuItem>
            <DropdownMenuItem>Relatório de Inadimplência</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="text-brand-foreground/90 text-sm hover:text-brand-foreground transition-colors">
          Relatório
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`text-sm transition-colors ${isActive("/cnab-recebimentos") ? "text-brand-foreground font-semibold" : "text-brand-foreground/90 hover:text-brand-foreground"}`}>
              Tesouraria <ChevronDown className="inline h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuItem>Parametrização</DropdownMenuItem>
            <DropdownMenuItem>Pagamentos</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Recebimentos</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => navigate("/cnab-recebimentos")}>
                  CNAB Recebimentos
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>Lançamentos Contábeis</DropdownMenuItem>
            <DropdownMenuItem>Repasse Cobrança</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">👤</span>
          </div>
          <span className="text-brand-foreground text-sm">adm_gfesp</span>
        </div>
      </nav>
    </header>
  );
};
export default Header;

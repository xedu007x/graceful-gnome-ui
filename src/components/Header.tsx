import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-brand-dark">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-brand-foreground font-bold text-sm leading-tight">DESENVOLVE SP</h1>
              <p className="text-brand-foreground/70 text-[10px]">A AGÊNCIA DO EMPREENDEDOR</p>
            </div>
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
        {["Contrato", "Ofícios", "Relatório", "Tesouraria"].map((item) => (
          <button key={item} className="text-brand-foreground/90 text-sm hover:text-brand-foreground transition-colors">
            {item} {["Ofícios", "Tesouraria"].includes(item) && <ChevronDown className="inline h-3 w-3" />}
          </button>
        ))}
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

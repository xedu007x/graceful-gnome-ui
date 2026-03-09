import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt, BarChart3, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuCards = [
  {
    title: "Contratos",
    description: "Gerenciar contratos ativos",
    icon: FileText,
    path: "/contratos",
    count: 24,
  },
  {
    title: "CNAB Recebimentos",
    description: "Gerar contas a receber via CNAB",
    icon: Receipt,
    path: "/cnab-recebimentos",
    count: 165,
  },
  {
    title: "Relatórios",
    description: "Visualizar relatórios gerenciais",
    icon: BarChart3,
    path: "/relatorios",
    count: 12,
  },
  {
    title: "Tesouraria",
    description: "Gestão financeira e pagamentos",
    icon: Wallet,
    path: "/tesouraria",
    count: 8,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Painel Principal</h2>
        <p className="text-muted-foreground mb-8">Bem-vindo ao sistema GFESP - Selecione um módulo para começar</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuCards.map((card) => (
            <Card
              key={card.title}
              className="cursor-pointer hover:shadow-lg transition-shadow border-t-4 border-t-brand"
              onClick={() => navigate(card.path)}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-brand" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{card.description}</p>
                <span className="text-2xl font-bold text-foreground">{card.count}</span>
                <span className="text-sm text-muted-foreground ml-1">registros</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

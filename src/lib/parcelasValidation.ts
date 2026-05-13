// Regras CA 11 da HU: limite de parcelas por faixa de UFESPs.
export function getMaxParcelasPorUfesps(qtdUfesps: number): number {
  if (qtdUfesps <= 1000) return 2;
  if (qtdUfesps <= 5000) return 6;
  if (qtdUfesps <= 20000) return 12;
  if (qtdUfesps <= 40000) return 18;
  return 24;
}

export function getFaixaUfespsLabel(qtdUfesps: number): string {
  if (qtdUfesps <= 1000) return "até 1.000 UFESPs";
  if (qtdUfesps <= 5000) return "1.001 a 5.000 UFESPs";
  if (qtdUfesps <= 20000) return "5.001 a 20.000 UFESPs";
  if (qtdUfesps <= 40000) return "20.001 a 40.000 UFESPs";
  return "acima de 40.000 UFESPs";
}
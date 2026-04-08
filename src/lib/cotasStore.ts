export interface Cota {
  id: number;
  data: string; // dd/mm/yyyy
  valor: number; // valor numérico da cota
}

const STORAGE_KEY = "gfesp_cotas_diarias";
const STORAGE_VERSION_KEY = "gfesp_cotas_version";
const CURRENT_VERSION = "2";

const cotasIniciais: Cota[] = [
  { id: 1, data: "08/04/2025", valor: 2.9351388 },
];

export function getCotas(): Cota[] {
  const version = localStorage.getItem(STORAGE_VERSION_KEY);
  if (version === CURRENT_VERSION) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cotasIniciais));
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  return cotasIniciais;
}

export function saveCotas(cotas: Cota[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cotas));
}

export function addCota(data: string, valor: number): Cota[] {
  const cotas = getCotas();
  const existente = cotas.find(c => c.data === data);
  let updated: Cota[];
  if (existente) {
    updated = cotas.map(c => c.data === data ? { ...c, valor } : c);
  } else {
    updated = [{ id: Math.max(0, ...cotas.map(c => c.id)) + 1, data, valor }, ...cotas];
  }
  saveCotas(updated);
  return updated;
}

export function getCotaPorData(data: string): Cota | undefined {
  return getCotas().find(c => c.data === data);
}

export function getCotaMaisRecente(): Cota | undefined {
  const cotas = getCotas();
  if (!cotas.length) return undefined;
  return cotas.reduce((latest, c) => {
    const [d1, m1, y1] = latest.data.split("/").map(Number);
    const [d2, m2, y2] = c.data.split("/").map(Number);
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    return date2 > date1 ? c : latest;
  });
}

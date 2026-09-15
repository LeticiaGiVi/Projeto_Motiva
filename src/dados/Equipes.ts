import dadosEquipes from "./Equipes.json";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type StatusEquipe = "Em Campo" | "Disponível" | "Em Manutenção" | "De Férias";

export interface Equipe {
  id: string;
  nomeEquipe: string;
  baseOperacional: string;
  quantidadeMembros: number;
  membros: string[];
  diasOcupados: string[];
  diasVagos: string[];
  status: StatusEquipe;
  principaisVias: string[];
}

export interface Trecho {
  /** string original, ex: "Rod. Anhanguera (SP-330) - km 90 a 105" */
  original: string;
  /** ex: "Rod. Anhanguera (SP-330)" */
  via: string;
  /** ex: "km 90 a 105" */
  rotulo: string;
  kmInicio: number;
  kmFim: number;
}

export interface Funcionario {
  nome: string;
  equipe: string;
  equipeId: string;
  base: string;
  cargo: string;
  ativo: boolean;
}

/* ------------------------------------------------------------------ */
/* Dados                                                                */
/* ------------------------------------------------------------------ */

export const equipes: Equipe[] = dadosEquipes as Equipe[];

/* ------------------------------------------------------------------ */
/* Trechos / vias                                                       */
/* ------------------------------------------------------------------ */

function parseTrecho(raw: string): Trecho {
  const match = raw.match(/^(.*)\s-\s(km\s\d+\s+a\s+\d+)$/i);
  if (!match) {
    return { original: raw, via: raw, rotulo: "", kmInicio: 0, kmFim: 0 };
  }
  const [, via, rotulo] = match;
  const numeros = rotulo.match(/\d+/g)?.map(Number) ?? [0, 0];
  return {
    original: raw,
    via: via.trim(),
    rotulo,
    kmInicio: numeros[0],
    kmFim: numeros[1] ?? numeros[0],
  };
}

export function trechosDaEquipe(equipe: Equipe): Trecho[] {
  return equipe.principaisVias.map(parseTrecho);
}

export function trechosNaVia(equipe: Equipe, via: string): Trecho[] {
  return trechosDaEquipe(equipe).filter((t) => t.via === via);
}

export function viasDisponiveis(): string[] {
  const vias = new Set<string>();
  equipes.forEach((e) => trechosDaEquipe(e).forEach((t) => vias.add(t.via)));
  return Array.from(vias).sort();
}

export function kmAtual(equipe: Equipe): string {
  const trechos = trechosDaEquipe(equipe);
  return trechos[0]?.rotulo ?? "—";
}

/* ------------------------------------------------------------------ */
/* Datas                                                                */
/* ------------------------------------------------------------------ */

export function paraIso(ano: number, mes: number, dia: number): string {
  const mm = String(mes + 1).padStart(2, "0");
  const dd = String(dia).padStart(2, "0");
  return `${ano}-${mm}-${dd}`;
}

export function todasAsDatas(): string[] {
  const datas = new Set<string>();
  equipes.forEach((e) => {
    e.diasOcupados.forEach((d) => datas.add(d));
    e.diasVagos.forEach((d) => datas.add(d));
  });
  return Array.from(datas).sort();
}

export function mesInicial(): { ano: number; mes: number } {
  const [primeira] = todasAsDatas();
  if (!primeira) {
    const hoje = new Date();
    return { ano: hoje.getFullYear(), mes: hoje.getMonth() };
  }
  const [ano, mes] = primeira.split("-").map(Number);
  return { ano, mes: mes - 1 };
}

export function formatarData(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/* ------------------------------------------------------------------ */
/* Disponibilidade                                                      */
/* ------------------------------------------------------------------ */

export function ocupadaEm(equipe: Equipe, dia: string): boolean {
  return equipe.diasOcupados.includes(dia);
}

function combinaVia(equipe: Equipe, via?: string): boolean {
  return !via || trechosNaVia(equipe, via).length > 0;
}

export function equipesOcupadasNoDia(dia: string, via?: string): Equipe[] {
  return equipes.filter((e) => ocupadaEm(e, dia) && combinaVia(e, via));
}

export function equipesDisponiveisNoDia(dia: string, via?: string): Equipe[] {
  return equipes.filter(
    (e) =>
      e.status !== "Em Manutenção" &&
      e.status !== "De Férias" &&
      e.diasVagos.includes(dia) &&
      combinaVia(e, via),
  );
}

export function equipesIndisponiveisNoDia(dia: string, via?: string): Equipe[] {
  return equipes.filter(
    (e) =>
      (e.status === "Em Manutenção" || e.status === "De Férias") && combinaVia(e, via),
  );
}

export function proximoDiaVago(equipe: Equipe, dia: string): string | undefined {
  return equipe.diasVagos.filter((d) => d > dia).sort()[0];
}

/* ------------------------------------------------------------------ */
/* Agrupamentos / listagens                                             */
/* ------------------------------------------------------------------ */

export function equipesPorVia(): { via: string; equipes: Equipe[] }[] {
  return viasDisponiveis().map((via) => ({
    via,
    equipes: equipes.filter((e) => trechosNaVia(e, via).length > 0),
  }));
}

export function funcionarios(): Funcionario[] {
  return equipes.flatMap((e) =>
    e.membros.map((nome, index) => ({
      nome,
      equipe: e.nomeEquipe,
      equipeId: e.id,
      base: e.baseOperacional,
      cargo: index === 0 ? "Líder de Equipe" : "Podador",
      ativo: e.status !== "De Férias",
    })),
  );
}

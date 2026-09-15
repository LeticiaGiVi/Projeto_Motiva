// src/scripts/vegetacaoMock.ts
// Dados MOCKADOS de vegetação por ponto de monitoramento (a cada km de via).
// Determinísticos: a mesma subvia + km sempre gera o mesmo valor, então os
// dados não mudam a cada re-render / re-abertura do filtro.

export interface DadoVegetacao {
  /** tamanho da vegetação em cm, de 3 a 25 */
  tamanho: number;
  /** só é relevante (e só é considerado) quando tamanho > 15 */
  podaAgendada: boolean;
  /** data no formato dd/mm/aaaa, preenchida somente quando podaAgendada = true */
  dataPoda?: string;
}

// ---- PRNG determinístico (hash da chave -> seed -> mulberry32) ----------

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Faixas de tamanho x cor ---------------------------------------------
// 3–7cm verde | 7–12cm verde-amarelado | 12–15cm amarelo
// 15–22cm alaranjado | >22cm vermelho

export function faixaCor(tamanho: number): string {
  if (tamanho <= 7) return "#2ecc71"; // verde
  if (tamanho <= 12) return "#a4c639"; // verde amarelado
  if (tamanho <= 15) return "#f1c40f"; // amarelo
  if (tamanho <= 22) return "#e67e22"; // alaranjado
  return "#e74c3c"; // vermelho
}

export function rotuloFaixa(tamanho: number): string {
  if (tamanho <= 7) return "Baixa";
  if (tamanho <= 12) return "Moderada";
  if (tamanho <= 15) return "Atenção";
  if (tamanho <= 22) return "Alta";
  return "Crítica";
}

/**
 * Gera o dado mockado de vegetação de um ponto, identificado pela subvia
 * (ex.: "autoban-sp330") e pelo km do ponto.
 */
export function gerarDadoVegetacao(subviaId: string, km: number): DadoVegetacao {
  const rand = mulberry32(hashString(`${subviaId}|${km.toFixed(2)}`));

  const tamanho = Math.round((3 + rand() * (25 - 3)) * 10) / 10;

  if (tamanho > 15) {
    const podaAgendada = rand() > 0.4; // ~60% dos pontos críticos já têm poda marcada
    if (podaAgendada) {
      const diasAPartirDeHoje = 3 + Math.floor(rand() * 45); // poda entre 3 e 47 dias à frente
      const data = new Date();
      data.setDate(data.getDate() + diasAPartirDeHoje);
      return {
        tamanho,
        podaAgendada: true,
        dataPoda: data.toLocaleDateString("pt-BR"),
      };
    }
    return { tamanho, podaAgendada: false };
  }

  return { tamanho, podaAgendada: false };
}

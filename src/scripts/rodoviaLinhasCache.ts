// src/hooks/rodoviaLinhasCache.ts
// Cache persistente (localStorage) para a geometria das vias buscada na Overpass API.
// Objetivo: evitar refazer a mesma consulta à Overpass toda vez que o usuário
// marca/desmarca um filtro, mesmo depois de recarregar a página.

type LatLng = [number, number];

interface CacheEntry {
  data: LatLng[][]; // uma via pode ter múltiplos "ways" -> múltiplas polylines
  timestamp: number;
}

const CACHE_PREFIX = "rodovia_geom_";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias — geometria de via muda raramente

function getCacheKey(ref: string): string {
  return `${CACHE_PREFIX}${ref}`;
}

/** Lê do localStorage. Retorna null se não existir ou estiver expirado/corrompido. */
export function getFromCache(ref: string): LatLng[][] | null {
  try {
    const raw = localStorage.getItem(getCacheKey(ref));
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      localStorage.removeItem(getCacheKey(ref));
      return null;
    }
    return entry.data;
  } catch {
    // JSON corrompido ou localStorage indisponível (modo privado, quota etc.)
    return null;
  }
}

/** Grava no localStorage. Falha silenciosamente se a quota estourar. */
export function saveToCache(ref: string, data: LatLng[][]): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(getCacheKey(ref), JSON.stringify(entry));
  } catch (err) {
    // Provavelmente QuotaExceededError. Não é crítico: só significa
    // que essa via vai ser buscada de novo na próxima vez.
    console.warn(`Não foi possível cachear a via ${ref}:`, err);
  }
}

/** Limpa todas as entradas de cache de vias (útil para um botão "forçar atualização"). */
export function clearRodoviaCache(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

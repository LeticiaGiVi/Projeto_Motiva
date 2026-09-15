// src/scripts/geoUtils.ts
// Utilitários geográficos usados para posicionar marcos a cada quilômetro
// ao longo da geometria real das vias (vinda da Overpass API).

import type { Coordenada } from "./RodoviaLinhas";

export type { Coordenada };

const RAIO_TERRA_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distância em km entre dois pontos [lat, lon], pela fórmula de Haversine. */
export function distanciaKm(a: Coordenada, b: Coordenada): number {
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * RAIO_TERRA_KM * Math.asin(Math.sqrt(h));
}

function interpolar(a: Coordenada, b: Coordenada, t: number): Coordenada {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export interface PontoKm {
  posicao: Coordenada;
  /** km "oficial" do ponto (kmInicio do trecho + distância percorrida na linha) */
  km: number;
}

/**
 * Percorre uma linha (sequência de coordenadas vinda do OSM) e retorna um
 * ponto a cada `stepKm` quilômetros efetivamente percorridos ao longo dela.
 *
 * `kmInicio` desloca a numeração exibida para bater com o km oficial da
 * rodovia (ex.: um trecho que começa no km 62 da via).
 */
export function pontosACadaKm(
  linha: Coordenada[],
  stepKm = 1,
  kmInicio = 0
): PontoKm[] {
  if (linha.length < 2) return [];

  const pontos: PontoKm[] = [];
  let distanciaAcumulada = 0;
  let proximoAlvo = stepKm;

  for (let i = 0; i < linha.length - 1; i++) {
    const a = linha[i];
    const b = linha[i + 1];
    const distSegmento = distanciaKm(a, b);

    // Enquanto o próximo "alvo" (múltiplo de stepKm) cair dentro deste
    // segmento da linha, interpola a posição exata do marco.
    while (distSegmento > 0 && distanciaAcumulada + distSegmento >= proximoAlvo) {
      const distFaltante = proximoAlvo - distanciaAcumulada;
      const t = distFaltante / distSegmento;
      pontos.push({
        posicao: interpolar(a, b, t),
        km: kmInicio + proximoAlvo,
      });
      proximoAlvo += stepKm;
    }

    distanciaAcumulada += distSegmento;
  }

  return pontos;
}

/** Comprimento total (km) de uma linha, somando todos os segmentos. */
export function comprimentoTotalKm(linha: Coordenada[]): number {
  let total = 0;
  for (let i = 0; i < linha.length - 1; i++) {
    total += distanciaKm(linha[i], linha[i + 1]);
  }
  return total;
}

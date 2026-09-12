import { useEffect, useState } from "react";
import type { BBox } from "./viasData";

export type Coordenada = [number, number];

// Cache em memória: evita buscar a mesma rodovia de novo toda vez
// que o usuário marca/desmarca o filtro.
const cache = new Map<string, Coordenada[][]>();

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OsmNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

interface OsmWay {
  type: "way";
  id: number;
  nodes: number[];
}

type OsmElement = OsmNode | OsmWay | { type: string };

interface OsmResponse {
  elements: OsmElement[];
}

// Converte a resposta crua do Overpass em uma lista de linhas
// (cada `way` vira uma linha, já como [lat, lng][] pronta pro Leaflet).
function converterParaLinhas(osmData: OsmResponse): Coordenada[][] {
  const nos = new Map<number, Coordenada>();
  const ways: OsmWay[] = [];

  for (const el of osmData.elements) {
    if (el.type === "node") {
      const node = el as OsmNode;
      nos.set(node.id, [node.lat, node.lon]);
    } else if (el.type === "way") {
      ways.push(el as OsmWay);
    }
  }

  return ways
    .map((way) =>
      way.nodes
        .map((id) => nos.get(id))
        .filter((coord): coord is Coordenada => coord !== undefined)
    )
    .filter((linha) => linha.length > 1); // descarta ways sem geometria útil
}

interface ResultadoRodovia {
  linhas: Coordenada[][] | null;
  carregando: boolean;
  erro: string | null;
}

export function useRodoviaLinhas(ref: string, bbox?: BBox): ResultadoRodovia {
  const chave = `${ref}|${bbox?.join(",") ?? ""}`;
  const [linhas, setLinhas] = useState<Coordenada[][] | null>(
    cache.get(chave) ?? null
  );
  const [carregando, setCarregando] = useState(!cache.has(chave));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(chave)) {
      setLinhas(cache.get(chave)!);
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);
    setErro(null);

    const filtroArea = bbox ? `(${bbox.join(",")})` : "";
    const overpassQuery = `
      [out:json][timeout:25];
      (
        way["highway"]["ref"~"${ref}"]${filtroArea};
      );
      out body;
      >;
      out skel qt;
    `;

    fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(overpassQuery),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Overpass respondeu ${res.status}`);
        return res.json();
      })
      .then((osmData: OsmResponse) => {
        const resultado = converterParaLinhas(osmData);
        if (!cancelado) {
          cache.set(chave, resultado);
          setLinhas(resultado);
        }
      })
      .catch((e) => {
        if (!cancelado) setErro(e.message);
        console.error(`Erro ao carregar rodovia ${ref}:`, e);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [chave, ref, bbox]);

  return { linhas, carregando, erro };
}
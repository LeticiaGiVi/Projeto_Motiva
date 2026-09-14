import { useEffect, useState } from "react";
import type { BBox } from "./viasData";
import { getFromCache, saveToCache } from "./rodoviaLinhasCache";

export type Coordenada = [number, number];

const cache = new Map<string, Coordenada[][]>();
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";


const emAndamento = new Map<string, Promise<OsmResponse>>();

const MAX_CONCORRENTES = 2;
let ativos = 0;
const fila: Array<() => void> = [];

function comLimite<T>(tarefa: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const executar = () => {
      ativos++;
      tarefa()
        .then(resolve, reject)
        .finally(() => {
          ativos--;
          const proxima = fila.shift();
          if (proxima) proxima();
        });
    };
    if (ativos < MAX_CONCORRENTES) executar();
    else fila.push(executar);
  });
}

interface OsmNode { type: "node"; id: number; lat: number; lon: number; }
interface OsmWay { type: "way"; id: number; nodes: number[]; }
type OsmElement = OsmNode | OsmWay | { type: string };
interface OsmResponse { elements: OsmElement[]; }

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
    .map((way) => way.nodes.map((id) => nos.get(id)).filter((c): c is Coordenada => c !== undefined))
    .filter((linha) => linha.length > 1);
}

// retry com backoff simples para 429 (rate limit) e 504 (timeout do servidor)
async function buscarComRetry(query: string, tentativas = 3): Promise<OsmResponse> {
  for (let i = 0; i < tentativas; i++) {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });

    if (res.status === 429 || res.status === 504) {
      if (i === tentativas - 1) throw new Error(`Overpass indisponível (${res.status}) após ${tentativas} tentativas`);
      await new Promise((r) => setTimeout(r, 1500 * (i + 1))); // 1.5s, 3s, 4.5s...
      continue;
    }
    if (!res.ok) throw new Error(`Overpass respondeu ${res.status}`);
    return res.json();
  }
  throw new Error("Overpass indisponível");
}

interface ResultadoRodovia {
  linhas: Coordenada[][] | null;
  carregando: boolean;
  erro: string | null;
}

// nomeBusca: usado como alternativa/complemento ao ref, para casos onde o
// ref cadastrado (ex: "SPI-102/330") não é o valor real da tag no OSM.
export function useRodoviaLinhas(ref: string, bbox?: BBox, nomeBusca?: string): ResultadoRodovia {
  const chave = `${ref}|${nomeBusca ?? ""}|${bbox?.join(",") ?? ""}`;
  const [linhas, setLinhas] = useState<Coordenada[][] | null>(cache.get(chave) ?? null);
  const [carregando, setCarregando] = useState(!cache.has(chave));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // 1) já está em memória (cache da sessão)? usa direto
    if (cache.has(chave)) {
      setLinhas(cache.get(chave)!);
      setCarregando(false);
      return;
    }

    // 2) está no localStorage e ainda válido? usa direto, sem ir à rede.
    //    Também alimenta o cache em memória pra não precisar reler o
    //    localStorage se o componente remontar na mesma sessão.
    const doLocalStorage = getFromCache(chave);
    if (doLocalStorage) {
      cache.set(chave, doLocalStorage);
      setLinhas(doLocalStorage);
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);
    setErro(null);

    const filtroArea = bbox ? `(${bbox.join(",")})` : "";
    const clausulas = [`way["highway"]["ref"~"${ref}"]${filtroArea};`];
    if (nomeBusca) {
      clausulas.push(`way["highway"]["name"~"${nomeBusca}"]${filtroArea};`);
    }

    const overpassQuery = `
      [out:json][timeout:25];
      (
        ${clausulas.join("\n        ")}
      );
      out body;
      >;
      out skel qt;
    `;

    let promise = emAndamento.get(chave);
    if (!promise) {
      promise = comLimite(() => buscarComRetry(overpassQuery));
      emAndamento.set(chave, promise);
      promise.finally(() => {
        // só remove se ainda for a promise atual (evita corrida com uma
        // nova busca que já tenha começado pra mesma chave)
        if (emAndamento.get(chave) === promise) emAndamento.delete(chave);
      });
    }

    promise
      .then((osmData) => {
        const resultado = converterParaLinhas(osmData);
        console.log(`[Overpass] ref="${ref}" nome="${nomeBusca ?? ""}" -> ${resultado.length} linha(s)`);
        if (!cancelado) {
          cache.set(chave, resultado);
          saveToCache(chave, resultado); // <- persiste no localStorage
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

    return () => { cancelado = true; };
  }, [chave, ref, nomeBusca, bbox]);

  return { linhas, carregando, erro };
}
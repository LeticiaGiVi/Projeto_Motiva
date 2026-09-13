export type BBox = [number, number, number, number]; // [sul, oeste, norte, leste]

export interface Subvia {
  id: string;
  nome: string;
  ref: string;
  nomeBusca?: string;
  bbox?: BBox;
  cor?: string;
}

export interface Via {
  id: string;
  nome: string;
  subvias: Subvia[];
}

export const coresPorVia: Record<string, string> = {
  autoban: "#d71919",
  riosp: "#1976d2",
  rodoanel: "#f39c12",
  sorocabana: "#27ae60",
  spvias: "#8e44ad",
  minas_sp: "#16a085",
};

// bbox aproximado do estado de SP, usado como padrão quando a ref já é única
const BBOX_ESTADO_SP: BBox = [-25.3, -53.1, -19.7, -44.1];

export const viasData: Via[] = [
  {
    id: "autoban",
    nome: "Autoban",
    subvias: [
      { id: "autoban-sp330", nome: "SP-330 - Rodovia Anhanguera", ref: "SP-330", bbox: BBOX_ESTADO_SP },
      { id: "autoban-sp348", nome: "SP-348 - Rodovia dos Bandeirantes", ref: "SP-348", bbox: BBOX_ESTADO_SP },
      { id: "autoban-sp300", nome: "SP-300 - Rodovia Dom Gabriel Paulino Bueno Couto", ref: "SP-300", bbox: BBOX_ESTADO_SP },
      { id: "autoban-spi102-330", nome: "SPI-102/330 - Rodovia Adalberto Panzan", ref: "SPA-102/330", nomeBusca: "Adalberto Panzan", bbox: BBOX_ESTADO_SP },
    ],
  },
  {
    id: "riosp",
    nome: "RioSP",
    subvias: [
      { id: "riosp-br101", nome: "BR-101 (Rio Santos)", ref: "BR-101", bbox: BBOX_ESTADO_SP },
      { id: "riosp-br116", nome: "BR-116 (Via Dutra)", ref: "BR-116", bbox: BBOX_ESTADO_SP },
    ],
  },
  {
    id: "rodoanel",
    nome: "RodoAnel",
    subvias: [
      { id: "rodoanel-sp021-band", nome: "SP-021 - Rodoanel Mário Covas - Sentido Bandeirantes", ref: "SP-021", bbox: [-23.75, -46.85, -23.4, -46.4] },
      { id: "rodoanel-sp021-lit", nome: "SP-021 - Rodoanel Mário Covas - Sentido Litoral", ref: "SP-021", bbox: [-23.75, -46.85, -23.4, -46.4] },
    ],
  },
  {
    id: "sorocabana",
    nome: "Sorocabana",
    subvias: [
      // bbox mais estreito (região de Sorocaba) pra não pegar o trecho da SPVias
      { id: "soro-spa160-250", nome: "SPA-160/250 - José de Almeida Rosa", ref: "SPA-160/250", nomeBusca: "Almeida Rosa", bbox: BBOX_ESTADO_SP },
      { id: "soro-spa103-079", nome: "SPA-103/079 - Doutor Miguel Affonso Ferreira de Castilho", ref: "SPA-103/079", nomeBusca: "Castilho", bbox: BBOX_ESTADO_SP },
      { id: "soro-spa104-079", nome: "SPA-104/079 - João Guimarães", ref: "SPA-104/079", nomeBusca: "Guimarães", bbox: BBOX_ESTADO_SP },
      { id: "soro-spa053-280", nome: "SPA-053/280 - Prefeito Livio Tagliassachi", ref: "SPA-053/280", nomeBusca: "Tagliassachi", bbox: BBOX_ESTADO_SP },
      { id: "soro-spi087-270", nome: "SPI-087/270 - Raposo Tavares", ref: "SPI-087/270", nomeBusca: "Raposo Tavares", bbox: BBOX_ESTADO_SP },
      { id: "soro-spi060-270", nome: "SPI-060/270 - Raposo Tavares", ref: "SPI-060/270", nomeBusca: "Raposo Tavares", bbox: BBOX_ESTADO_SP },
      { id: "soro-spi091-270", nome: "SPI-091/270 - Doutor Celso Charuri", ref: "SPI-091/270", nomeBusca: "Celso Charuri", bbox: BBOX_ESTADO_SP },
    ],
  },
  {
    id: "spvias",
    nome: "SPVias",
    subvias: [
      // bbox mais a oeste/interior, pra não sobrepor com o trecho da Sorocabana
      { id: "spvias-sp280", nome: "SP 280 - Rodovia Castello Branco", ref: "SP-280", bbox: [-22.9, -49.6, -22.3, -47.5] },
      { id: "spvias-sp127a", nome: "SP 127 - Rodovia Antônio Romano Schincariol", ref: "SP-127", bbox: BBOX_ESTADO_SP },
      { id: "spvias-sp127b", nome: "SP 127 - Rodovia Francisco da Silva Pontes", ref: "SP-127", bbox: BBOX_ESTADO_SP },
      { id: "spvias-sp255", nome: "SP 255 - Rodovia João Mellão", ref: "SP-255", bbox: BBOX_ESTADO_SP },
      { id: "spvias-sp258", nome: "SP 258 - Rodovia Francisco Alves Negrão", ref: "SP-258", bbox: BBOX_ESTADO_SP },
      { id: "spvias-sp270", nome: "SP 270 - Rodovia Raposo Tavares", ref: "SP-270", bbox: [-22.9, -49.6, -22.3, -47.5] },
    ],
  },
  {
    id: "minas_sp",
    nome: "minas_sp",
    subvias: [
      { id: "minassp-br381-norte", nome: "BR-381 - Fernão Dias - Sentido Belo Horizonte (Norte)", ref: "BR-381", bbox: BBOX_ESTADO_SP },
      { id: "minassp-br381-sul", nome: "BR-381 - Fernão Dias - Sentido São Paulo (Sul)", ref: "BR-381", bbox: BBOX_ESTADO_SP },
    ],
  },
];
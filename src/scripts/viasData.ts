export type BBox = [number, number, number, number]; // [sul, oeste, norte, leste]

export interface TrechoKm {
  kmInicio: number;
  kmFim: number;
}

export interface Subvia {
  id: string;
  nome: string;
  ref: string;
  nomeBusca?: string;
  bbox?: BBox;
  cor?: string;
  // Nome da concessionária conforme aparece nos sites oficiais (ARTESP/ANTT).
  // Ainda não confirmado como valor exato da tag OSM "operator" — verifique
  // no Overpass Turbo antes de usar como filtro de query.
  operador?: string;
  // Trecho(s) km efetivamente concedido(s) à Motiva/CCR, conforme ARTESP/ANTT.
  // Uma rodovia pode ter mais de um trecho descontínuo sob a mesma concessão.
  trechos?: TrechoKm[];
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

// bbox aproximado do estado de SP, usado como fallback (não use se já
// tiver um bbox mais apertado do trecho específico)
const BBOX_ESTADO_SP: BBox = [-25.3, -53.1, -19.7, -44.1];

export const viasData: Via[] = [
  {
    id: "autoban",
    nome: "Autoban",
    subvias: [
      // Trecho km 11-158: de São Paulo/Perus até a região de Limeira
      { id: "autoban-sp330", nome: "SP-330 - Rodovia Anhanguera", ref: "SP-330", bbox: [-23.6, -47.6, -22.5, -46.6], operador: "AutoBAn", trechos: [{ kmInicio: 11, kmFim: 158 }] },
      // Trecho km 13-173: de São Paulo até a região de Iracemápolis/Limeira
      { id: "autoban-sp348", nome: "SP-348 - Rodovia dos Bandeirantes", ref: "SP-348", bbox: [-23.6, -47.6, -22.4, -46.6], operador: "AutoBAn", trechos: [{ kmInicio: 13, kmFim: 173 }] },
      // Trecho km 62-64: em Jundiaí (bairro Medeiros)
      { id: "autoban-sp300", nome: "SP-300 - Rodovia Dom Gabriel Paulino Bueno Couto", ref: "SP-300", bbox: [-23.25, -47.05, -23.1, -46.9], operador: "AutoBAn", trechos: [{ kmInicio: 62, kmFim: 64 }] },
      // Trecho km 1-7: interligação Anhanguera/Bandeirantes em Campinas
      // (ref oficial ARTESP é "SPI-102/330", não "SPA-102/330")
      { id: "autoban-spi102-330", nome: "SPI-102/330 - Rodovia Adalberto Panzan", ref: "SPI-102/330", nomeBusca: "Adalberto Panzan", bbox: [-22.95, -47.25, -22.85, -47.05], operador: "AutoBAn", trechos: [{ kmInicio: 1, kmFim: 7 }] },
    ],
  },
  {
    id: "riosp",
    nome: "RioSP",
    subvias: [
      // Trecho km 0-52.1 no litoral norte, entre a divisa SP/RJ e Ubatuba
      { id: "riosp-br101", nome: "BR-101 (Rio Santos)", ref: "BR-101", bbox: [-23.55, -45.2, -23.2, -44.8], operador: "RioSP", trechos: [{ kmInicio: 0, kmFim: 52.1 }] },
      // Trecho km 0-230.6: de São Paulo até a região de Queluz (divisa SP/RJ)
      { id: "riosp-br116", nome: "BR-116 (Via Dutra)", ref: "BR-116", bbox: [-23.55, -46.65, -22.4, -44.7], operador: "RioSP", trechos: [{ kmInicio: 0, kmFim: 230.6 }] },
    ],
  },
  {
    id: "rodoanel",
    nome: "RodoAnel",
    subvias: [
      // A Motiva só administra o trecho OESTE (km 0-30); norte/sul/leste são
      // de outras concessionárias
      // Trecho oeste (km 0-30): de Perus (zona norte de SP) até Embu das
      // Artes, passando por Barueri, Osasco e Carapicuíba
      { id: "rodoanel-sp021-band", nome: "SP-021 - Rodoanel Mário Covas - Sentido Bandeirantes", ref: "SP-021", bbox: [-23.68, -46.9, -23.38, -46.75], operador: "RodoAnel", trechos: [{ kmInicio: 0, kmFim: 30 }] },
      { id: "rodoanel-sp021-lit", nome: "SP-021 - Rodoanel Mário Covas - Sentido Litoral", ref: "SP-021", bbox: [-23.68, -46.9, -23.38, -46.75], operador: "RodoAnel", trechos: [{ kmInicio: 0, kmFim: 30 }] },
    ],
  },
  {
    id: "sorocabana",
    nome: "Sorocabana",
    subvias: [
      // Vias auxiliares/acessos - sem km oficial detalhado ainda, usando um
      // bbox mais amplo que cobre toda a área da concessão Sorocabana
      // (em vez do estado inteiro)
      { id: "soro-spa160-250", nome: "SPA-160/250 - José de Almeida Rosa", ref: "SPA-160/250", nomeBusca: "Almeida Rosa", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spa103-079", nome: "SPA-103/079 - Doutor Miguel Affonso Ferreira de Castilho", ref: "SPA-103/079", nomeBusca: "Castilho", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spa104-079", nome: "SPA-104/079 - João Guimarães", ref: "SPA-104/079", nomeBusca: "Guimarães", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spa053-280", nome: "SPA-053/280 - Prefeito Livio Tagliassachi", ref: "SPA-053/280", nomeBusca: "Tagliassachi", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spi087-270", nome: "SPI-087/270 - Raposo Tavares", ref: "SPI-087/270", nomeBusca: "Raposo Tavares", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spi060-270", nome: "SPI-060/270 - Raposo Tavares", ref: "SPI-060/270", nomeBusca: "Raposo Tavares", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      { id: "soro-spi091-270", nome: "SPI-091/270 - Doutor Celso Charuri", ref: "SPI-091/270", nomeBusca: "Celso Charuri", bbox: [-24.7, -49.0, -23.05, -47.0], operador: "Sorocabana" },
      // Vias principais do lote, com bbox apertado pelo km oficial (ARTESP)
      { id: "soro-sp270", nome: "SP-270 - Rodovia Raposo Tavares (trecho Sorocabana)", ref: "SP-270", bbox: [-23.75, -48.0, -23.35, -47.1], operador: "Sorocabana", trechos: [{ kmInicio: 34.07, kmFim: 59.435 }, { kmInicio: 63.265, kmFim: 87.655 }, { kmInicio: 88.675, kmFim: 115.76 }] },
      { id: "soro-sp280", nome: "SP-280 - Rodovia Castello Branco (trecho Sorocabana)", ref: "SP-280", bbox: [-23.35, -47.55, -23.05, -47.0], operador: "Sorocabana", trechos: [{ kmInicio: 54.14, kmFim: 79.74 }] },
      { id: "soro-sp079", nome: "SP-079 - Rodovia Tenente Celestino Américo", ref: "SP-079", bbox: [-24.35, -48.0, -23.35, -47.3], operador: "Sorocabana", trechos: [{ kmInicio: 97.65, kmFim: 213.565 }] },
      { id: "soro-sp250", nome: "SP-250 - Rodovia Bunjiro Nakao / José de Carvalho / Nestor Fogaça", ref: "SP-250", bbox: [-24.7, -49.0, -23.35, -47.5], operador: "Sorocabana", trechos: [{ kmInicio: 45, kmFim: 68.7 }, { kmInicio: 70.994, kmFim: 101.18 }, { kmInicio: 102.28, kmFim: 176.55 }] },
      { id: "soro-sp264", nome: "SP-264 - Rodovia João Leme dos Santos", ref: "SP-264", bbox: [-23.95, -47.95, -23.35, -47.35], operador: "Sorocabana", trechos: [{ kmInicio: 102.05, kmFim: 143.525 }] },
      { id: "soro-sp075", nome: "SP-075 - Rodovia Senador José Ermírio de Moraes (Castelinho)", ref: "SP-075", bbox: [-23.5, -47.45, -23.3, -47.2], operador: "Sorocabana", trechos: [{ kmInicio: 0, kmFim: 15.695 }] },
    ],
  },
  {
    id: "spvias",
    nome: "SPVias",
    subvias: [
      // bbox apertado pelo km oficial (ARTESP/ABCR), trecho SPVias começa
      // onde o trecho Sorocabana termina (mesma rodovia, concessões diferentes)
      { id: "spvias-sp280", nome: "SP 280 - Rodovia Castello Branco", ref: "SP-280", bbox: [-23.55, -49.6, -22.75, -47.75], operador: "SPVias", trechos: [{ kmInicio: 129.6, kmFim: 315.034 }] },
      { id: "spvias-sp127a", nome: "SP 127 - Rodovia Antônio Romano Schincariol", ref: "SP-127", bbox: [-24.05, -49.6, -22.95, -47.9], operador: "SPVias", trechos: [{ kmInicio: 105.9, kmFim: 213.15 }] },
      { id: "spvias-sp127b", nome: "SP 127 - Rodovia Francisco da Silva Pontes", ref: "SP-127", bbox: [-24.05, -49.6, -22.95, -47.9], operador: "SPVias", trechos: [{ kmInicio: 105.9, kmFim: 213.15 }] },
      { id: "spvias-sp255", nome: "SP 255 - Rodovia João Mellão", ref: "SP-255", bbox: [-23.45, -49.35, -22.85, -48.6], operador: "SPVias", trechos: [{ kmInicio: 237.77, kmFim: 288.19 }] },
      { id: "spvias-sp258", nome: "SP 258 - Rodovia Francisco Alves Negrão", ref: "SP-258", bbox: [-24.5, -49.7, -23.55, -48.55], operador: "SPVias", trechos: [{ kmInicio: 222.8, kmFim: 342.6 }] },
      { id: "spvias-sp270", nome: "SP 270 - Rodovia Raposo Tavares", ref: "SP-270", bbox: [-23.75, -48.75, -23.15, -47.9], operador: "SPVias", trechos: [{ kmInicio: 115.5, kmFim: 168.21 }] },
    ],
  },
  {
    id: "minas_sp",
    nome: "minas_sp",
    subvias: [
      // Trecho SP: km 0 (divisa MG/SP) a km 90,4 (entroncamento c/ Via Dutra),
      // passando por Guarulhos, Mairiporã, Atibaia, Bragança Paulista, Vargem
      { id: "minassp-br381-norte", nome: "BR-381 - Fernão Dias - Sentido Belo Horizonte (Norte)", ref: "BR-381", bbox: [-23.55, -46.75, -22.4, -45.95], operador: "Minas_SP", trechos: [{ kmInicio: 0, kmFim: 90.4 }] },
      { id: "minassp-br381-sul", nome: "BR-381 - Fernão Dias - Sentido São Paulo (Sul)", ref: "BR-381", bbox: [-23.55, -46.75, -22.4, -45.95], operador: "Minas_SP", trechos: [{ kmInicio: 0, kmFim: 90.4 }] },
    ],
  },
];
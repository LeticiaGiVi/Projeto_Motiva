import { useState } from "react";

type Periodo = "Hoje" | "Últimos 7 dias" | "Último mês" | "Personalizado";
type TipoRelatorio =
  | "Todos"
  | "Resumo Executivo"
  | "Detalhamento por Trecho"
  | "Desempenho de Equipes"
  | "Análise de Crescimento";

const relatoriosGerados = [
  { titulo: "Relatório Semanal – 08 a 14/08/2026", data: "14/08/2026 às 14:30" },
  { titulo: "Relatório Mensal – Julho/2026", data: "01/08/2026 às 09:00" },
  { titulo: "Relatório Semanal – 01 a 07/08/2026", data: "07/08/2026 às 18:15" },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState<Periodo>("Últimos 7 dias");
  const [dataInicio, setDataInicio] = useState("2026-08-08");
  const [dataFim, setDataFim] = useState("2026-08-14");
  const [tipo, setTipo] = useState<TipoRelatorio>("Todos");
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(0);

  const tipos: TipoRelatorio[] = [
    "Todos",
    "Resumo Executivo",
    "Detalhamento por Trecho",
    "Desempenho de Equipes",
    "Análise de Crescimento",
  ];

  return (
    <div className="w-full flex bg-gray-50 min-h-screen">
      {/* Sidebar de filtros */}
      <aside className="w-72 shrink-0 bg-white border-r border-gray-100 p-5 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Período</p>
          <div className="flex flex-col gap-1.5 text-sm text-gray-600">
            {(["Hoje", "Últimos 7 dias", "Último mês"] as Periodo[]).map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="periodo"
                  checked={periodo === p}
                  onChange={() => setPeriodo(p)}
                  className="accent-violet-600"
                />
                {p}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="periodo"
                checked={periodo === "Personalizado"}
                onChange={() => setPeriodo("Personalizado")}
                className="accent-violet-600"
              />
              Personalizado
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Data início</p>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Data final</p>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Tipo de Relatório</p>
          <div className="flex flex-wrap gap-1.5">
            {tipos.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`text-xs px-2.5 py-1.5 rounded-full border ${
                  tipo === t
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <button className="bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium rounded-md py-2">
            Aplicar filtros
          </button>
          <button className="text-violet-600 text-sm">Limpar filtros</button>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Opções de salvamento</p>
          <div className="flex flex-col gap-2">
            <button className="border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50">
              Salvar como PDF
            </button>
            <button className="border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50">
              Salvar como CSV
            </button>
            <button className="border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50">
              Salvar como imagem (PNG)
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Relatórios gerados</p>
          <p className="text-[11px] text-gray-400 mb-2">Clique em um relatório para visualizar</p>
          <div className="flex flex-col gap-2">
            {relatoriosGerados.map((r, i) => (
              <button
                key={i}
                onClick={() => setRelatorioSelecionado(i)}
                className={`text-left border rounded-md px-3 py-2 text-xs flex items-start gap-2 ${
                  relatorioSelecionado === i
                    ? "border-violet-300 bg-violet-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className="mt-0.5">📄</span>
                <span>
                  <p className="font-medium text-gray-700">{r.titulo}</p>
                  <p className="text-gray-400">{r.data}</p>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Painel principal */}
      <main className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Última atualização: {relatoriosGerados[relatorioSelecionado].data.split(" às")[0]} – 14:30
          </p>
          <button className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            ↻ Atualizar dados
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex-1 flex flex-col">
          <p className="text-xs text-gray-400 tracking-wide mb-1">PRÉ-VISUALIZAÇÃO DO RELATÓRIO</p>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {relatoriosGerados[relatorioSelecionado].titulo}
              </h2>
              <p className="text-xs text-gray-400">
                Gerado em {relatoriosGerados[relatorioSelecionado].data}
              </p>
            </div>
            <button className="bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium rounded-md px-4 py-2 flex items-center gap-2">
              ⬇ Baixar Relatório <span className="text-xs bg-violet-500 px-1.5 py-0.5 rounded">PDF ▾</span>
            </button>
          </div>

          <div className="flex-1 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center text-gray-400 py-16">
            <span className="text-3xl mb-3">📄</span>
            <p className="text-sm font-medium text-gray-500">Documento em branco</p>
            <p className="text-xs mt-1 max-w-sm">
              O conteúdo do relatório estruturado será renderizado aqui neste painel. Use os botões de
              exportação acima para salvar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
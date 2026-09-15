import { useMemo, useState } from "react";
import { GroupedBarChart, SimpleBarChart, MultiLineChart } from "../componentes/Charts/MiniCharts";
import {
  equipes,
  viasDisponiveis,
  trechosNaVia,
  todasAsDatas,
  equipesOcupadasNoDia,
  equipesIndisponiveisNoDia,
  paraIso,
  type StatusEquipe,
} from "../dados/Equipes";

type Periodo = "Hoje" | "Últimos 7 dias" | "Último mês" | "Personalizado";
type Severidade = "Crítico" | "Alerta" | "Normal";

const statusStyles: Record<StatusEquipe, string> = {
  "Em Campo": "bg-blue-100 text-blue-600",
  Disponível: "bg-emerald-100 text-emerald-600",
  "Em Manutenção": "bg-amber-100 text-amber-600",
  "De Férias": "bg-gray-100 text-gray-500",
};

const severidadeStyles: Record<Severidade, { active: string; base: string }> = {
  Crítico: { base: "border-red-200 text-red-500", active: "bg-red-500 text-white border-red-500" },
  Alerta: { base: "border-amber-200 text-amber-500", active: "bg-amber-500 text-white border-amber-500" },
  Normal: { base: "border-emerald-200 text-emerald-500", active: "bg-emerald-500 text-white border-emerald-500" },
};

const coresEquipe = ["bg-blue-500", "bg-amber-400", "bg-emerald-500", "bg-violet-500"];

/** Usa a data de hoje se ela existir na base; senão cai pra primeira data disponível. */
function diaDeReferencia(datas: string[]): string {
  const hoje = new Date();
  const iso = paraIso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return datas.includes(iso) ? iso : datas[0] ?? iso;
}

export default function Dashboards() {
  const nomesEquipes = useMemo(() => equipes.map((e) => e.nomeEquipe), []);
  const vias = useMemo(viasDisponiveis, []);
  const datas = useMemo(todasAsDatas, []);
  const diaAtual = useMemo(() => diaDeReferencia(datas), [datas]);

  const [periodo, setPeriodo] = useState<Periodo>("Hoje");
  const [via, setVia] = useState(vias[0] ?? "");
  const [equipesSelecionadas, setEquipesSelecionadas] = useState<string[]>(nomesEquipes);
  const [severidades, setSeveridades] = useState<Severidade[]>([]);
  const [km, setKm] = useState(0);

  function toggleEquipe(equipe: string) {
    setEquipesSelecionadas((prev) =>
      prev.includes(equipe) ? prev.filter((e) => e !== equipe) : [...prev, equipe],
    );
  }

  function toggleSeveridade(sev: Severidade) {
    setSeveridades((prev) => (prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]));
  }

  // Equipes filtradas pelo que está marcado na barra lateral.
  const equipesFiltradas = useMemo(
    () => equipes.filter((e) => equipesSelecionadas.includes(e.nomeEquipe)),
    [equipesSelecionadas],
  );

  // KPI: quantas equipes (do filtro) estão em campo no dia de referência, na via escolhida.
  const emCampoHoje = useMemo(
    () =>
      equipesOcupadasNoDia(diaAtual, via || undefined).filter((e) =>
        equipesSelecionadas.includes(e.nomeEquipe),
      ),
    [diaAtual, via, equipesSelecionadas],
  );

  // KPI / seção "pendentes": equipes indisponíveis (manutenção / férias) na via escolhida.
  const pendentesHoje = useMemo(
    () =>
      equipesIndisponiveisNoDia(diaAtual, via || undefined).filter((e) =>
        equipesSelecionadas.includes(e.nomeEquipe),
      ),
    [diaAtual, via, equipesSelecionadas],
  );

  // Disponibilidade real: dias vagos de cada equipe sobre o total de dias cobertos pela base.
  const disponibilidade = useMemo(
    () =>
      equipesFiltradas.map((e) => ({
        equipe: e.nomeEquipe,
        dias: e.diasVagos.length,
        totalDias: datas.length || 1,
      })),
    [equipesFiltradas, datas],
  );

  // Tabela de trechos: dados reais (via, km, equipe responsável, status),
  // filtrados pela via e pelo slider de km. Substitui a antiga tabela
  // "altura/poda/eficiência", que não existe na base de dados atual.
  const resumoTrechos = useMemo(() => {
    if (!via) return [];
    return equipesFiltradas
      .flatMap((e) =>
        trechosNaVia(e, via).map((t) => ({
          chave: `${e.id}-${t.original}`,
          via: t.via,
          trecho: t.rotulo,
          kmInicio: t.kmInicio,
          kmFim: t.kmFim,
          equipe: e.nomeEquipe,
          status: e.status,
        })),
      )
      .filter((t) => km === 0 || (km >= t.kmInicio && km <= t.kmFim));
  }, [equipesFiltradas, via, km]);

  return (
    <div className="w-full flex bg-gray-50 min-h-screen">
      {/* Sidebar de filtros */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 p-5 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Período:</p>
          <div className="flex flex-wrap gap-1.5">
            {(["Hoje", "Últimos 7 dias", "Último mês", "Personalizado"] as Periodo[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`text-xs px-2.5 py-1.5 rounded-md border ${
                  periodo === p
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Via:</p>
          <select
            value={via}
            onChange={(e) => setVia(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-600"
          >
            {vias.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Equipe:</p>
          <div className="flex flex-col gap-1.5">
            {nomesEquipes.map((equipe) => (
              <label key={equipe} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={equipesSelecionadas.includes(equipe)}
                  onChange={() => toggleEquipe(equipe)}
                  className="accent-violet-600"
                />
                {equipe}
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-gray-600 pt-1 border-t border-gray-100 mt-1">
              <input
                type="checkbox"
                checked={equipesSelecionadas.length === nomesEquipes.length}
                onChange={() =>
                  setEquipesSelecionadas(
                    equipesSelecionadas.length === nomesEquipes.length ? [] : [...nomesEquipes],
                  )
                }
                className="accent-violet-600"
              />
              Todas
            </label>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Severidade:</p>
          <div className="flex gap-1.5 flex-wrap">
            {(["Crítico", "Alerta", "Normal"] as Severidade[]).map((sev) => (
              <button
                key={sev}
                onClick={() => toggleSeveridade(sev)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  severidades.includes(sev)
                    ? severidadeStyles[sev].active
                    : `bg-white ${severidadeStyles[sev].base}`
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            *Ainda sem dado real de severidade por trecho na base atual.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Quilômetros:</p>
          <input
            type="range"
            min={0}
            max={260}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0</span>
            <span>{km}</span>
          </div>
        </div>

        <button className="mt-2 bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium rounded-md py-2">
          Aplicar Filtros
        </button>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 flex flex-col gap-4">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Equipes em campo"
            value={String(emCampoHoje.length)}
            subtitle={`De ${equipesSelecionadas.length} equipes selecionadas, hoje`}
          />
          <KpiCard
            title="Equipes indisponíveis"
            value={String(pendentesHoje.length)}
            subtitle="Em manutenção ou de férias hoje"
            valueClassName={pendentesHoje.length > 0 ? "text-red-500" : "text-gray-800"}
          />
          <KpiCard
            title="Trechos monitorados"
            value={String(resumoTrechos.length)}
            subtitle={via ? `Na via ${via}` : "Selecione uma via"}
          />
          <KpiCard
            title="Equipes cadastradas"
            value={String(equipes.length)}
            subtitle="Total na base operacional"
          />
        </div>

        {/* Cortes atrasados + histórico — mantidos como exemplo visual;
            ainda não há série histórica de km cortado/programado na base. */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800">Equipes indisponíveis na via</h3>
              <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-500">
                <option>Semana</option>
                <option>Mês</option>
              </select>
            </div>
            {pendentesHoje.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">Nenhuma equipe indisponível hoje.</p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {pendentesHoje.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between text-sm border border-gray-100 rounded-md px-3 py-2"
                  >
                    <span className="text-gray-700">{e.nomeEquipe}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[e.status]}`}>
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Histórico de atrasos</h3>
              <span className="text-xs text-gray-400">exemplo</span>
            </div>
            <SimpleBarChart
              labels={["D-9", "D-8", "D-7", "D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Hoje"]}
              values={[7, 5, 6.5, 4, 5, 3, 4, 2, 2.5, 1.5]}
            />
          </Card>
        </div>

        {/* Disponibilidade real por equipe */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Disponibilidade de equipe</h3>
                <span className="text-gray-400">⋮</span>
              </div>
              {disponibilidade.length === 0 ? (
                <p className="text-xs text-gray-400">Nenhuma equipe selecionada.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {disponibilidade.map((d) => (
                    <div key={d.equipe}>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{d.equipe}</span>
                        <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
                          {d.dias} de {d.totalDias} dias
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-700 rounded-full"
                          style={{ width: `${(d.dias / d.totalDias) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <MultiLineChart
                labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
                maxValue={60}
                series={[
                  { name: "Km cortados", color: "#6366f1", values: [15, 20, 30, 35, 40, 38] },
                  { name: "altura média", color: "#f472b6", values: [35, 30, 45, 40, 35, 42] },
                  { name: "eficiência do corte", color: "#38bdf8", values: [10, 15, 18, 20, 22, 25] },
                ]}
              />
            </Card>
          </div>

          <Card className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Equipes por status</h3>
            <div className="flex flex-col gap-3">
              {(["Em Campo", "Disponível", "Em Manutenção", "De Férias"] as StatusEquipe[]).map(
                (status, i) => {
                  const qtd = equipesFiltradas.filter((e) => e.status === status).length;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${coresEquipe[i]}`} />
                      <span className="text-xs text-gray-600 flex-1">{status}</span>
                      <span className="text-xs text-gray-400">{qtd}</span>
                    </div>
                  );
                },
              )}
            </div>
          </Card>
        </div>

        {/* Tabela de trechos — dados reais de via/km/equipe/status */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">
            Resumo dos trechos {via ? `— ${via}` : ""}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-100">
                  <th className="py-2 font-medium">Via</th>
                  <th className="py-2 font-medium">Trecho</th>
                  <th className="py-2 font-medium">Equipe responsável</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {resumoTrechos.map((t) => (
                  <tr key={t.chave} className="border-b border-gray-50 text-gray-600">
                    <td className="py-2.5">{t.via}</td>
                    <td className="py-2.5">{t.trecho}</td>
                    <td className="py-2.5">{t.equipe}</td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status]}`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {resumoTrechos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 text-sm">
                      Nenhum trecho encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>{children}</div>;
}

function KpiCard({
  title,
  value,
  subtitle,
  valueClassName = "text-gray-800",
}: {
  title: string;
  value: string;
  subtitle: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </Card>
  );
}
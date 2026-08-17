import { useState } from "react";
import { GroupedBarChart, SimpleBarChart, MultiLineChart } from "../componentes/Charts/MiniCharts";

type Periodo = "Hoje" | "Últimos 7 dias" | "Último mês" | "Personalizado";
type Severidade = "Crítico" | "Alerta" | "Normal";
type StatusTrecho = "Crítico" | "Alerta" | "Normal";

const EQUIPES = ["Equipe 1", "Equipe 2", "Equipe 3", "Equipe 4"];

const statusStyles: Record<StatusTrecho, string> = {
  Crítico: "bg-red-100 text-red-600",
  Alerta: "bg-amber-100 text-amber-600",
  Normal: "bg-emerald-100 text-emerald-600",
};

const severidadeStyles: Record<Severidade, { active: string; base: string }> = {
  Crítico: { base: "border-red-200 text-red-500", active: "bg-red-500 text-white border-red-500" },
  Alerta: { base: "border-amber-200 text-amber-500", active: "bg-amber-500 text-white border-amber-500" },
  Normal: { base: "border-emerald-200 text-emerald-500", active: "bg-emerald-500 text-white border-emerald-500" },
};

const resumoTrechos: {
  km: string;
  alturaAtual: string;
  ultimaPoda: string;
  diasDesde: number;
  proximoCorte: string;
  status: StatusTrecho;
}[] = [
  { km: "0–10", alturaAtual: "18 cm", ultimaPoda: "12/01", diasDesde: 28, proximoCorte: "15/02", status: "Crítico" },
  { km: "10–20", alturaAtual: "14 cm", ultimaPoda: "18/01", diasDesde: 22, proximoCorte: "08/02", status: "Alerta" },
  { km: "20–30", alturaAtual: "10 cm", ultimaPoda: "02/02", diasDesde: 6, proximoCorte: "16/02", status: "Normal" },
  { km: "30–40", alturaAtual: "12 cm", ultimaPoda: "05/02", diasDesde: 3, proximoCorte: "12/02", status: "Normal" },
  { km: "40–50", alturaAtual: "16 cm", ultimaPoda: "10/01", diasDesde: 30, proximoCorte: "10/02", status: "Crítico" },
  { km: "50–60", alturaAtual: "9 cm", ultimaPoda: "15/01", diasDesde: 25, proximoCorte: "10/02", status: "Alerta" },
];

const disponibilidade = [
  { equipe: "Equipe 1", dias: 3 },
  { equipe: "Equipe 2", dias: 0 },
  { equipe: "Equipe 3", dias: 5 },
  { equipe: "Equipe 4", dias: 3 },
];

const horasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const coresEquipe = ["bg-blue-500", "bg-amber-400", "bg-emerald-500", "bg-violet-500"];

export default function Dashboards() {
  const [periodo, setPeriodo] = useState<Periodo>("Hoje");
  const [via, setVia] = useState("RoSP");
  const [equipesSelecionadas, setEquipesSelecionadas] = useState<string[]>(["Alpha"]);
  const [severidades, setSeveridades] = useState<Severidade[]>([]);
  const [km, setKm] = useState(0);

  function toggleEquipe(equipe: string) {
    setEquipesSelecionadas((prev) =>
      prev.includes(equipe) ? prev.filter((e) => e !== equipe) : [...prev, equipe]
    );
  }

  function toggleSeveridade(sev: Severidade) {
    setSeveridades((prev) => (prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]));
  }

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
            <option value="RoSP">RoSP</option>
            <option value="BR-101">BR-101</option>
            <option value="BR-116">BR-116</option>
          </select>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Equipe:</p>
          <div className="flex flex-col gap-1.5">
            {EQUIPES.map((equipe) => (
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
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={equipesSelecionadas.length === EQUIPES.length}
                onChange={() =>
                  setEquipesSelecionadas(
                    equipesSelecionadas.length === EQUIPES.length ? [] : [...EQUIPES]
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
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Quilômetros:</p>
          <input
            type="range"
            min={0}
            max={100}
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
          <KpiCard title="Eficiência de Corte" value="2,35 KM/H" subtitle="Km cortados por horas trabalhadas" />
          <KpiCard title="Taxa de atrasos" value="5%" subtitle="25km de cortes pendentes" valueClassName="text-red-500" />
          <KpiCard title="Quilômetros cortados hoje" value="10 KM" subtitle="Km programados para hoje" />
          <KpiCard title="Equipes em campo" value="7" subtitle="Equipes trabalhando agora" />
        </div>

        {/* Cortes atrasados + histórico */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800">Cortes atrasados</h3>
              <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-500">
                <option>Semana</option>
                <option>Mês</option>
              </select>
            </div>
            <p className="text-violet-600 text-lg font-semibold mb-2">3 KM</p>
            <GroupedBarChart
              labels={["Equipe 1", "Equipe 2", "Equipe 3", "Equipe 4", "Equipe 5", "Equipe 6"]}
              seriesA={[6, 5, 7, 6, 5, 7]}
              seriesB={[3, 4, 3, 5, 3, 4]}
              legendA="Km Programados"
              legendB="Km cortados"
              maxValue={8}
            />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Histórico de atrasos</h3>
              <span className="text-xs text-gray-400">cortes</span>
            </div>
            <SimpleBarChart
              labels={["D-9", "D-8", "D-7", "D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Hoje"]}
              values={[7, 5, 6.5, 4, 5, 3, 4, 2, 2.5, 1.5]}
            />
          </Card>
        </div>

        {/* Disponibilidade / linha de tendência + horas trabalhadas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Disponibilidade de equipe por</h3>
                <span className="text-gray-400">⋮</span>
              </div>
              <div className="flex flex-col gap-3">
                {disponibilidade.map((d) => (
                  <div key={d.equipe}>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{d.equipe}</span>
                      <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
                        {d.dias} de 7 dias
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-700 rounded-full"
                        style={{ width: `${(d.dias / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
            <h3 className="font-semibold text-gray-800 mb-4">Horas trabalhadas por equipe</h3>
            <div className="flex flex-col gap-4">
              {horasSemana.map((dia) => (
                <div key={dia} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-6">{dia}</span>
                  <div className="flex gap-2 flex-1">
                    {coresEquipe.map((cor, i) => (
                      <div key={i} className={`h-8 flex-1 rounded-md ${cor}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabela resumo dos trechos */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Resumo dos trechos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-100">
                  <th className="py-2 font-medium">KM</th>
                  <th className="py-2 font-medium">Altura atual</th>
                  <th className="py-2 font-medium">Última poda</th>
                  <th className="py-2 font-medium">Dias desde</th>
                  <th className="py-2 font-medium">Próximo corte</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {resumoTrechos.map((t) => (
                  <tr key={t.km} className="border-b border-gray-50 text-gray-600">
                    <td className="py-2.5">{t.km}</td>
                    <td className="py-2.5">{t.alturaAtual}</td>
                    <td className="py-2.5">{t.ultimaPoda}</td>
                    <td className="py-2.5">{t.diasDesde}</td>
                    <td className="py-2.5">{t.proximoCorte}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
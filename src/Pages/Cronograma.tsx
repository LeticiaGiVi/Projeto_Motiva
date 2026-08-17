import { useState } from "react";

const DIAS_SEMANA = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Agosto 2026 começa numa Sábado (dia 1) — grade fixa para o mês exibido no design
const DIAS_AGOSTO_2026: (number | null)[] = [
  null, null, null, null, null, null, 1,
  2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29,
  30, 31, null, null, null, null, null,
];

const agendados = [
  { km: "KM 10–18", equipe: "Equipe 10" },
  { km: "KM 10–18", equipe: "Equipe 10" },
  { km: "KM 10–18", equipe: "Equipe 10" },
  { km: "KM 10–18", equipe: "Equipe 10" },
];

const sugestoes = [
  { km: "KM 15–22", equipe: "Equipe 3" },
  { km: "KM 60–67", equipe: "Equipe 4" },
  { km: "KM 88–102", equipe: "Equipe 3" },
];

const trechosPendentes: {
  km: string;
  descricao: string;
  tag: string;
  tagClass: string;
  cardClass: string;
}[] = [
  {
    km: "KM 45–52",
    descricao: "Atraso 3 dias",
    tag: "Prioridade Alta",
    tagClass: "bg-red-500 text-white",
    cardClass: "bg-orange-50 border border-orange-100",
  },
  {
    km: "KM 70–78",
    descricao: "Aguardando atribuição de equipe",
    tag: "Sem equipe",
    tagClass: "bg-amber-100 text-amber-700",
    cardClass: "bg-amber-50 border border-amber-100",
  },
  {
    km: "KM 100–110",
    descricao: "Sugestão pendente de aprovação",
    tag: "Pendente",
    tagClass: "bg-blue-100 text-blue-700",
    cardClass: "bg-blue-50 border border-blue-100",
  },
];

export default function Cronograma() {
  const [via, setVia] = useState("RoSP");
  const [diaSelecionado, setDiaSelecionado] = useState(10);

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6 flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-gray-800">Cronograma de poda</h1>

      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Calendário */}
        <Card>
          <select
            value={via}
            onChange={(e) => setVia(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-500 mb-3"
          >
            <option value="RoSP">RoSP</option>
            <option value="BR-101">BR-101</option>
          </select>

          <div className="flex items-center justify-between mb-3">
            <button className="text-gray-400 hover:text-gray-600 px-2">‹</button>
            <span className="font-semibold text-gray-800 text-sm">Agosto 2026</span>
            <button className="text-gray-400 hover:text-gray-600 px-2">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 mb-1">
            {DIAS_SEMANA.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {DIAS_AGOSTO_2026.map((dia, i) => {
              const isSelecionado = dia === diaSelecionado;
              const isFimDeSemana = i % 7 === 0 || i % 7 === 6;
              return (
                <button
                  key={i}
                  disabled={dia === null}
                  onClick={() => dia && setDiaSelecionado(dia)}
                  className={`h-7 rounded-md flex items-center justify-center ${
                    dia === null
                      ? ""
                      : isSelecionado
                      ? "bg-violet-600 text-white font-medium"
                      : isFimDeSemana
                      ? "text-red-400 hover:bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {dia ?? ""}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Agendados */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Agendados</h3>
          <div className="flex flex-col gap-2">
            {agendados.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 text-xs"
              >
                <div className="text-gray-600">
                  <p className="font-medium">{a.km} · 10:18</p>
                  <p className="text-gray-400">Equipe: {a.equipe}</p>
                </div>
                <div className="flex gap-2 text-violet-600 shrink-0">
                  <button className="hover:underline">Alterar ✎</button>
                  <button className="hover:underline text-red-400">Deletar 🗑</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sugestões */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Sugestões</h3>
          <div className="flex flex-col gap-2">
            {sugestoes.map((s, i) => (
              <div key={i} className="border border-gray-100 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-700">{s.km}</p>
                  <span className="text-gray-400">{s.equipe}</span>
                </div>
                <div className="flex gap-1.5">
                  <button className="flex-1 bg-emerald-500 text-white rounded-md py-1">Aceitar ✓</button>
                  <button className="flex-1 bg-blue-500 text-white rounded-md py-1">Alterar ✎</button>
                  <button className="flex-1 bg-red-500 text-white rounded-md py-1">Negar ✕</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trechos não alocados / com atraso */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Trechos não alocados / com atraso</h3>
          <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">
            {trechosPendentes.length} pendentes
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {trechosPendentes.map((t) => (
            <div key={t.km} className={`rounded-lg p-3 ${t.cardClass}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{t.km}</p>
                  <p className="text-xs text-gray-500">{t.descricao}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${t.tagClass}`}>{t.tag}</span>
              </div>
              <button className="w-full bg-violet-600 hover:bg-violet-700 transition text-white text-xs font-medium rounded-md py-1.5">
                Resolver agora
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>{children}</div>;
}
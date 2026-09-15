import { useMemo, useState } from "react";
import {
  type Equipe,
  equipesDisponiveisNoDia,
  equipesIndisponiveisNoDia,
  equipesOcupadasNoDia,
  mesInicial,
  paraIso,
  proximoDiaVago,
  todasAsDatas,
  trechosDaEquipe,
  trechosNaVia,
  viasDisponiveis,
} from "../dados/Equipes";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** Grade do mês com células vazias antes do dia 1 e depois do último dia. */
function gerarGrade(ano: number, mes: number): (number | null)[] {
  const offset = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const celulas: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d);
  while (celulas.length % 7 !== 0) celulas.push(null);
  return celulas;
}

export default function Cronograma() {
  const vias = useMemo(viasDisponiveis, []);
  const datas = useMemo(todasAsDatas, []);
  const inicial = useMemo(mesInicial, []);

  const [via, setVia] = useState<string>("todas");
  const [ano, setAno] = useState(inicial.ano);
  const [mes, setMes] = useState(inicial.mes);
  const [diaSelecionado, setDiaSelecionado] = useState<string>(datas[0] ?? "");

  const grade = useMemo(() => gerarGrade(ano, mes), [ano, mes]);
  const viaFiltro = via === "todas" ? undefined : via;

  const agendados = useMemo(
    () => equipesOcupadasNoDia(diaSelecionado, viaFiltro),
    [diaSelecionado, viaFiltro],
  );
  const sugestoes = useMemo(
    () => equipesDisponiveisNoDia(diaSelecionado, viaFiltro),
    [diaSelecionado, viaFiltro],
  );
  const pendentes = useMemo(
    () => equipesIndisponiveisNoDia(diaSelecionado, viaFiltro),
    [diaSelecionado, viaFiltro],
  );

  function navegarMes(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  function trechoDaEquipe(equipe: Equipe): string {
    const lista = viaFiltro ? trechosNaVia(equipe, viaFiltro) : trechosDaEquipe(equipe);
    return lista.map((t) => t.rotulo).join(" · ") || "—";
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6 flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-gray-800">Cronograma de poda</h1>

      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Calendário */}
        <Card>
          <select
            value={via}
            onChange={(e) => setVia(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-500 mb-3 w-full"
          >
            <option value="todas">Todas as vias</option>
            {vias.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navegarMes(-1)}
              className="text-gray-400 hover:text-gray-600 px-2"
              aria-label="Mês anterior"
            >
              ‹
            </button>
            <span className="font-semibold text-gray-800 text-sm">
              {MESES[mes]} {ano}
            </span>
            <button
              onClick={() => navegarMes(1)}
              className="text-gray-400 hover:text-gray-600 px-2"
              aria-label="Próximo mês"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 mb-1">
            {DIAS_SEMANA.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {grade.map((dia, i) => {
              const iso = dia ? paraIso(ano, mes, dia) : "";
              const isSelecionado = iso !== "" && iso === diaSelecionado;
              const temDados = iso !== "" && datas.includes(iso);
              const isFimDeSemana = i % 7 === 0 || i % 7 === 6;

              return (
                <button
                  key={i}
                  disabled={dia === null}
                  onClick={() => iso && setDiaSelecionado(iso)}
                  className={`h-7 rounded-md flex items-center justify-center relative ${
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
                  {temDados && !isSelecionado && (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-violet-400" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Agendados */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Agendados</h3>
            <span className="text-xs text-gray-400">{agendados.length}</span>
          </div>

          {agendados.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhuma equipe em campo neste dia.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {agendados.map((equipe) => (
                <div
                  key={equipe.id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 text-xs"
                >
                  <div className="text-gray-600">
                    <p className="font-medium">{trechoDaEquipe(equipe)}</p>
                    <p className="text-gray-400">
                      {equipe.nomeEquipe} · {equipe.quantidadeMembros} pessoas
                    </p>
                  </div>
                  <div className="flex gap-2 text-violet-600 shrink-0">
                    <button className="hover:underline">Alterar ✎</button>
                    <button className="hover:underline text-red-400">Deletar 🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sugestões */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Sugestões</h3>
            <span className="text-xs text-gray-400">{sugestoes.length}</span>
          </div>

          {sugestoes.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhuma equipe livre neste dia.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sugestoes.map((equipe) => (
                <div key={equipe.id} className="border border-gray-100 rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-700">{trechoDaEquipe(equipe)}</p>
                    <span className="text-gray-400">{equipe.nomeEquipe}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="flex-1 bg-emerald-500 text-white rounded-md py-1">Aceitar ✓</button>
                    <button className="flex-1 bg-blue-500 text-white rounded-md py-1">Alterar ✎</button>
                    <button className="flex-1 bg-red-500 text-white rounded-md py-1">Negar ✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Trechos sem cobertura */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Trechos não alocados / com atraso</h3>
          <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">
            {pendentes.length} pendentes
          </span>
        </div>

        {pendentes.length === 0 ? (
          <p className="text-xs text-gray-400">Todos os trechos do dia têm equipe responsável.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendentes.map((equipe) => {
              const emFerias = equipe.status === "De Férias";
              const retorno = proximoDiaVago(equipe, diaSelecionado);
              return (
                <div
                  key={equipe.id}
                  className={`rounded-lg p-3 ${
                    emFerias
                      ? "bg-amber-50 border border-amber-100"
                      : "bg-orange-50 border border-orange-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-700 text-sm">{trechoDaEquipe(equipe)}</p>
                      <p className="text-xs text-gray-500">
                        {equipe.nomeEquipe} {emFerias ? "de férias" : "em manutenção"}
                        {retorno ? " · trecho sem equipe no dia" : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                        emFerias ? "bg-amber-100 text-amber-700" : "bg-red-500 text-white"
                      }`}
                    >
                      {equipe.status}
                    </span>
                  </div>
                  <button className="w-full bg-violet-600 hover:bg-violet-700 transition text-white text-xs font-medium rounded-md py-1.5">
                    Resolver agora
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>{children}</div>;
}
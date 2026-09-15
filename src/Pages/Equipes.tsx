import EquipeCard from "../componentes/EquipeCard/EquipeCard";
import {
  Equipe,
  equipesPorVia,
  formatarData,
  kmAtual,
  mesInicial,
  ocupadaEm,
  paraIso,
  proximoDiaVago,
  todasAsDatas,
  trechosNaVia,
} from "../dados/Equipes.json";

// Dia de referência: usa a data de hoje se ela estiver no período do JSON,
// senão cai para a primeira data disponível.
function diaDeReferencia(): string {
  const hoje = new Date();
  const iso = paraIso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const datas = todasAsDatas();
  if (datas.includes(iso)) return iso;
  const { ano, mes } = mesInicial();
  return datas[0] ?? paraIso(ano, mes, 1);
}

const checklistPadrao = [
  { horario: "07:30", descricao: "Início do expediente", concluido: true },
  { horario: "08:00", descricao: "Chegada no local", concluido: true },
  { horario: "12:30", descricao: "Pausa", concluido: false },
  { horario: "16:00", descricao: "Finalização", concluido: false },
];

function statusDoDia(equipe: Equipe, dia: string): string {
  if (equipe.status === "Em Manutenção" || equipe.status === "De Férias") return equipe.status;
  return ocupadaEm(equipe, dia) ? "Cortando" : "Disponível";
}

function proximaTarefa(equipe: Equipe, dia: string, via: string) {
  const trechos = trechosNaVia(equipe, via);
  const km = trechos[trechos.length - 1]?.rotulo ?? kmAtual(equipe);
  const proximo = proximoDiaVago(equipe, dia);
  return {
    km,
    quando: proximo ? `${formatarData(proximo)} 07:30` : "Sem janela livre",
  };
}

export default function Equipes() {
  const dia = diaDeReferencia();
  const grupos = equipesPorVia();

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="mx-auto p-6 flex flex-col gap-8">
        {grupos.map((grupo) => (
          <section key={grupo.via} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold text-gray-800">{grupo.via}</h2>
              <span className="text-xs text-gray-400">
                {grupo.equipes.length} {grupo.equipes.length === 1 ? "equipe" : "equipes"}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {grupo.equipes.map((equipe) => {
                const trechos = trechosNaVia(equipe, grupo.via);
                return (
                  <EquipeCard
                    key={`${grupo.via}-${equipe.id}`}
                    nome={equipe.nomeEquipe}
                    status={statusDoDia(equipe, dia)}
                    kmAtual={trechos[0]?.rotulo ?? kmAtual(equipe)}
                    checklist={checklistPadrao}
                    proximaTarefa={proximaTarefa(equipe, dia, grupo.via)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
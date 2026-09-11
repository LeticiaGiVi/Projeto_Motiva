import EquipeCard from "../componentes/EquipeCard/EquipeCard";

type EquipeInfo = {
  nome: string;
  status: string;
  kmAtual: string;
};

type ViaGroup = {
  via: string;
  equipes: EquipeInfo[];
};

const vias: ViaGroup[] = [
  {
    via: "Autoban",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
  {
    via: "Motiva Pantanal",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
  {
    via: "RioSP",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
  {
    via: "RodoAnel",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
  {
    via: "Motiva Sorocabana",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
  {
    via: "SPVias",
    equipes: [
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
      { nome: "Equipe 1", status: "Cortando", kmAtual: "KM 17 - 20" },
    ],
  },
];

const checklistPadrao = [
  { horario: "07:30", descricao: "Início do expediente", concluido: true },
  { horario: "08:00", descricao: "Chegada no local", concluido: true },
  { horario: "12:30", descricao: "Pausa", concluido: false },
  { horario: "16:00", descricao: "Finalização", concluido: false },
];

const proximaTarefaPadrao = { km: "KM 22 - 30", quando: "Amanhã 15:00" };

export default function Equipes() {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className=" mx-auto p-6 flex flex-col gap-8">
        {vias.map((grupo) => (
          <section key={grupo.via} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-800">{grupo.via}</h2>
            <div className="grid grid-cols-4 gap-4">
              {grupo.equipes.map((equipe, i) => (
                <EquipeCard
                  key={`${grupo.via}-${i}`}
                  nome={equipe.nome}
                  status={equipe.status}
                  kmAtual={equipe.kmAtual}
                  checklist={checklistPadrao}
                  proximaTarefa={proximaTarefaPadrao}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
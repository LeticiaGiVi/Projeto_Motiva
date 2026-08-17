import { useState } from "react";

type ChecklistItem = {
  horario: string;
  descricao: string;
  concluido: boolean;
};

type EquipeCardProps = {
  nome: string;
  status: string;
  kmAtual: string;
  checklist: ChecklistItem[];
  proximaTarefa: { km: string; quando: string };
  defaultOpen?: boolean;
};

export default function EquipeCard({
  nome,
  status,
  kmAtual,
  checklist,
  proximaTarefa,
  defaultOpen = false,
}: EquipeCardProps) {
  const [aberto, setAberto] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Cabeçalho — sempre clicável, controla o estado */}
      <button
        onClick={() => setAberto((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
            <span className="text-violet-400 text-lg">👤</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-800">{nome}</p>
            <span className="inline-block mt-1 text-xs font-medium bg-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full">
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-violet-100 text-violet-600 px-3 py-1 rounded-full">
            {kmAtual}
          </span>
          {/* Ícone gira conforme o estado — só CSS, sem lib extra */}
          <span
            className={`text-gray-400 transition-transform duration-200 ${
              aberto ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Conteúdo expansível — grid-template-rows anima sem medir altura em JS */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: aberto ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 border-t border-gray-100">
            <div className="p-4 flex flex-col gap-2.5">
              {checklist.map((item, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <input type="checkbox" checked={item.concluido} readOnly className="accent-violet-600" />
                  {item.horario} – {item.descricao}
                </label>
              ))}
            </div>
            <div className="p-4 border-l border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 mb-2">Próxima tarefa agendada</p>
              <p className="text-base font-semibold text-gray-800">{proximaTarefa.km}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{proximaTarefa.quando}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exemplo de uso:
//
// <EquipeCard
//   nome="Equipe 1"
//   status="Cortando"
//   kmAtual="KM 17 - 20"
//   checklist={[
//     { horario: "07:30", descricao: "Início do expediente", concluido: true },
//     { horario: "08:00", descricao: "Chegada no local", concluido: true },
//     { horario: "12:30", descricao: "Pausa", concluido: false },
//     { horario: "16:00", descricao: "Finalização", concluido: false },
//   ]}
//   proximaTarefa={{ km: "KM 22 - 30", quando: "Amanhã 15:00" }}
// />
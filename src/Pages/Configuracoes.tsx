import { useState } from "react";
 
type Status = "Ativo" | "Inativo";
 
type Funcionario = {
  nome: string;
  equipe: string;
  cargo: string;
  status: Status;
};
 
const funcionarios: Funcionario[] = [
  { nome: "Ana Beatriz Silva", equipe: "Equipe A", cargo: "Operador", status: "Ativo" },
  { nome: "Bruno Costa", equipe: "Equipe B", cargo: "Supervisor", status: "Ativo" },
  { nome: "Camila Oliveira", equipe: "Equipe C", cargo: "Técnico", status: "Inativo" },
  { nome: "Daniel Souza", equipe: "Equipe A", cargo: "Operador", status: "Ativo" },
  { nome: "Elena Martins", equipe: "Equipe B", cargo: "Supervisor", status: "Inativo" },
  { nome: "Felipe Almeida", equipe: "Equipe C", cargo: "Técnico", status: "Ativo" },
];
 
const statusStyles: Record<Status, string> = {
  Ativo: "bg-emerald-100 text-emerald-600",
  Inativo: "bg-red-100 text-red-500",
};
 
const abas = ["Funcionários", "Trechos da Via", "Parâmetros Gerais"] as const;
type Aba = (typeof abas)[number];
 
export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("Funcionários");
 
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">
            CONFIGURAÇÕES / CADASTROS
          </h1>
        </div>
 
        <div className="flex gap-6 border-b border-gray-200">
          {abas.map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`pb-2 text-sm ${
                abaAtiva === aba
                  ? "text-violet-600 font-semibold border-b-2 border-violet-600"
                  : "text-gray-500"
              }`}
            >
              {aba}
            </button>
          ))}
        </div>
 
        {abaAtiva === "Funcionários" && (
          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Funcionários</h2>
              <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium rounded-md px-4 py-2">
                + Adicionar Funcionário
              </button>
            </div>
 
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-100">
                    <th className="py-2 font-medium">Nome</th>
                    <th className="py-2 font-medium">Equipe</th>
                    <th className="py-2 font-medium">Cargo</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((f, i) => (
                    <tr key={i} className="border-b border-gray-50 text-gray-700">
                      <td className="py-3">{f.nome}</td>
                      <td className="py-3">{f.equipe}</td>
                      <td className="py-3">{f.cargo}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[f.status]}`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3 text-gray-400">
                          <button aria-label="Editar" className="hover:text-violet-600">
                            <PencilIcon />
                          </button>
                          <button aria-label="Excluir" className="hover:text-red-500">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
 
        {abaAtiva === "Trechos da Via" && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-gray-500 text-sm">Cadastro de trechos da via em breve.</p>
          </div>
        )}
 
        {abaAtiva === "Parâmetros Gerais" && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-gray-500 text-sm">Parâmetros gerais em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
 
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
 
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

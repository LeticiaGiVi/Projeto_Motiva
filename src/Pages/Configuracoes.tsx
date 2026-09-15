import { useMemo, useState } from "react";
import { equipes, funcionarios, trechosDaEquipe } from "../dados/Equipes.json";

const abas = ["Funcionários", "Trechos da Via", "Parâmetros Gerais"] as const;
type Aba = (typeof abas)[number];

export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("Funcionários");
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const todos = funcionarios();
    if (!termo) return todos;
    return todos.filter(
      (f) => f.nome.toLowerCase().includes(termo) || f.equipe.toLowerCase().includes(termo),
    );
  }, [busca]);

  const trechos = useMemo(
    () =>
      equipes.flatMap((e) =>
        trechosDaEquipe(e).map((t) => ({
          chave: `${e.id}-${t.original}`,
          via: t.via,
          rotulo: t.rotulo,
          extensao: t.kmFim - t.kmInicio,
          equipe: e.nomeEquipe,
          base: e.baseOperacional,
        })),
      ),
    [],
  );

  const totalMembros = equipes.reduce((soma, e) => soma + e.quantidadeMembros, 0);
  const bases = new Set(equipes.map((e) => e.baseOperacional));

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
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold text-gray-800">
                Funcionários <span className="text-gray-400 font-normal">({lista.length})</span>
              </h2>
              <div className="flex items-center gap-3">
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou equipe"
                  className="text-sm border border-gray-200 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 transition text-white text-sm font-medium rounded-md px-4 py-2">
                  + Adicionar Funcionário
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-100">
                    <th className="py-2 font-medium">Nome</th>
                    <th className="py-2 font-medium">Equipe</th>
                    <th className="py-2 font-medium">Base</th>
                    <th className="py-2 font-medium">Cargo</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((f) => (
                    <tr
                      key={`${f.equipeId}-${f.nome}`}
                      className="border-b border-gray-50 text-gray-700"
                    >
                      <td className="py-3">{f.nome}</td>
                      <td className="py-3">{f.equipe}</td>
                      <td className="py-3 text-gray-500">{f.base}</td>
                      <td className="py-3">{f.cargo}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            f.ativo
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {f.ativo ? "Ativo" : "Inativo"}
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
                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400 text-sm">
                        Nenhum funcionário encontrado para “{busca}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === "Trechos da Via" && (
          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-800">
              Trechos da via <span className="text-gray-400 font-normal">({trechos.length})</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-100">
                    <th className="py-2 font-medium">Via</th>
                    <th className="py-2 font-medium">Trecho</th>
                    <th className="py-2 font-medium">Extensão</th>
                    <th className="py-2 font-medium">Equipe responsável</th>
                    <th className="py-2 font-medium">Base</th>
                  </tr>
                </thead>
                <tbody>
                  {trechos.map((t) => (
                    <tr key={t.chave} className="border-b border-gray-50 text-gray-700">
                      <td className="py-3">{t.via}</td>
                      <td className="py-3">{t.rotulo}</td>
                      <td className="py-3">{t.extensao} km</td>
                      <td className="py-3">{t.equipe}</td>
                      <td className="py-3 text-gray-500">{t.base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === "Parâmetros Gerais" && (
          <div className="bg-white rounded-xl shadow-sm p-5 grid grid-cols-4 gap-4">
            <Indicador rotulo="Equipes cadastradas" valor={equipes.length} />
            <Indicador rotulo="Funcionários" valor={totalMembros} />
            <Indicador rotulo="Bases operacionais" valor={bases.size} />
            <Indicador rotulo="Trechos monitorados" valor={trechos.length} />
          </div>
        )}
      </div>
    </div>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <p className="text-2xl font-semibold text-gray-800">{valor}</p>
      <p className="text-xs text-gray-500 mt-1">{rotulo}</p>
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
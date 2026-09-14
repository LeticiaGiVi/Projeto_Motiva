import { viasData } from "../../scripts/viasData";

interface ViaFilterProps {
  viasExpandidas: Set<string>;
  selectedSubvias: Set<string>;
  onToggleViaExpandida: (viaId: string) => void;
  onToggleSubvia: (subviaId: string) => void;
}

export default function ViaFilter({
  viasExpandidas,
  selectedSubvias,
  onToggleViaExpandida,
  onToggleSubvia,
}: ViaFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Via:</label>

      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
        {viasData.map((via) => {
          const expandida = viasExpandidas.has(via.id);
          const qtdAtivas = via.subvias.filter((s) =>
            selectedSubvias.has(s.id)
          ).length;

          return (
            <div
              key={via.id}
              className="border-b border-gray-200 pb-1 last:border-b-0"
            >
              {/* Cabeçalho da via: só expande/colapsa a lista de pistas */}
              <button
                type="button"
                onClick={() => onToggleViaExpandida(via.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-1.5 bg-transparent py-1 text-left font-semibold text-gray-800"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`inline-block text-xs text-gray-500 transition-transform ${
                      expandida ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  {via.nome}
                </span>

                {qtdAtivas > 0 && (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-normal text-white">
                    {qtdAtivas}
                  </span>
                )}
              </button>

              {/* Lista de pistas: cada uma com toggle próprio, independente */}
              {expandida && (
                <div className="ml-5 mt-1 flex flex-col gap-1.5">
                  {via.subvias.map((subvia) => {
                    const ativa = selectedSubvias.has(subvia.id);

                    return (
                      <div
                        key={subvia.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-normal text-gray-600">
                          {subvia.nome}
                        </span>

                        <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={ativa}
                            onChange={() => onToggleSubvia(subvia.id)}
                            className="peer sr-only"
                          />
                          <span className="absolute inset-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600" />
                          <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
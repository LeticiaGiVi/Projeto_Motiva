import { viasData } from "../../scripts/viasData";

interface ViaFilterProps {
  selectedVias: Set<string>;
  selectedSubvias: Set<string>;
  onToggleVia: (viaId: string) => void;
  onToggleSubvia: (subviaId: string) => void;
}

export default function ViaFilter({
  selectedVias,
  selectedSubvias,
  onToggleVia,
  onToggleSubvia,
}: ViaFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Via:</label>

      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
        {viasData.map((via) => {
          const viaSelecionada = selectedVias.has(via.id);

          return (
            <div
              key={via.id}
              className="border-b border-gray-200 pb-1 last:border-b-0"
            >
              <label className="flex cursor-pointer items-center gap-1.5 font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={viaSelecionada}
                  onChange={() => onToggleVia(via.id)}
                  className="h-4 w-4 accent-blue-600"
                />
                {via.nome}
              </label>

              {/* Ao selecionar a via, exibe o checkbox de cada subvia */}
              {viaSelecionada && (
                <div className="ml-5 mt-1 flex flex-col gap-0.5">
                  {via.subvias.map((subvia) => (
                    <label
                      key={subvia.id}
                      className="flex cursor-pointer items-center gap-1.5 text-sm font-normal text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubvias.has(subvia.id)}
                        onChange={() => onToggleSubvia(subvia.id)}
                        className="h-3.5 w-3.5 accent-blue-600"
                      />
                      {subvia.nome}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
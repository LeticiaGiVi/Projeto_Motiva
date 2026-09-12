import { useMemo, useState } from "react";
import MapView from "../componentes/mapa/MapView.tsx";
import ViaFilter from "../componentes/Filtros/ViaFilter.tsx";
import { viasData } from "../scripts/viasData.ts";
import "../Style/MapPage.css";

export default function MapPage() {
  const [selectedVias, setSelectedVias] = useState<Set<string>>(new Set());
  const [selectedSubvias, setSelectedSubvias] = useState<Set<string>>(new Set());

  function toggleVia(viaId: string) {
    setSelectedVias((prev) => {
      const novo = new Set(prev);

      if (novo.has(viaId)) {
        novo.delete(viaId);

        // ao desmarcar a via, limpa também as subvias dela
        const via = viasData.find((v) => v.id === viaId);
        if (via) {
          setSelectedSubvias((prevSub) => {
            const novoSub = new Set(prevSub);
            via.subvias.forEach((s) => novoSub.delete(s.id));
            return novoSub;
          });
        }
      } else {
        novo.add(viaId);
      }

      return novo;
    });
  }

  function toggleSubvia(subviaId: string) {
    setSelectedSubvias((prev) => {
      const novo = new Set(prev);
      novo.has(subviaId) ? novo.delete(subviaId) : novo.add(subviaId);
      return novo;
    });
  }

  // Regras de exibição no mapa:
  // - via + subvia(s) marcadas  -> mostra só as subvias marcadas
  // - via marcada sem subvias   -> mostra todas as subvias da via
  // - via não marcada           -> não mostra nada
  const subviasVisiveis = useMemo(() => {
    const visiveis: string[] = [];

    for (const via of viasData) {
      if (!selectedVias.has(via.id)) continue;

      const marcadas = via.subvias.filter((s) => selectedSubvias.has(s.id));

      if (marcadas.length > 0) {
        visiveis.push(...marcadas.map((s) => s.id));
      } else {
        visiveis.push(...via.subvias.map((s) => s.id));
      }
    }

    return visiveis;
  }, [selectedVias, selectedSubvias]);

  return (
    <div className="map-page">
      <main className="map-content">
        <aside className="map-sidebar">
          <h2>Filtros</h2>

          <div className="filter">
            <label>Período:</label>
            <div className="period-buttons">
              <button>Hoje</button>
              <button className="selected">Últimos 7 dias</button>
              <button>Último mês</button>
              <button>Personalizado</button>
            </div>
          </div>

          {/* VIA - seletor hierárquico */}
          <div className="filter">
            <ViaFilter
              selectedVias={selectedVias}
              selectedSubvias={selectedSubvias}
              onToggleVia={toggleVia}
              onToggleSubvia={toggleSubvia}
            />
          </div>

          <div className="filter">
            <label>Equipe:</label>
            <div className="teams">
              <label><input type="checkbox" defaultChecked /> Equipe 1</label>
              <label><input type="checkbox" /> Equipe 2</label>
              <label><input type="checkbox" /> Equipe 3</label>
              <label><input type="checkbox" /> Equipe 4</label>
              <label><input type="checkbox" /> Todos</label>
            </div>
          </div>

          <div className="filter">
            <label>Seriedade:</label>
            <div className="severity">
              <button className="critical">Crítico</button>
              <button className="alert">Alerta</button>
              <button className="normal">Normal</button>
            </div>
          </div>

          <button className="apply-button">Aplicar Filtros</button>
        </aside>

        <section className="map-section">
          <MapView subviasVisiveis={subviasVisiveis} />
        </section>
      </main>
    </div>
  );
}
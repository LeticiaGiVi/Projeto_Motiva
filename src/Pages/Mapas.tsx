import { useMemo, useState } from "react";
import MapView from "../componentes/mapa/MapView.tsx";
import ViaFilter from "../componentes/Filtros/ViaFilter.tsx";
import "../Style/MapPage.css";

export default function MapPage() {
  // controla apenas quais grupos (vias) estão expandidos na lista do filtro
  const [viasExpandidas, setViasExpandidas] = useState<Set<string>>(new Set());

  // controla quais pistas (subvias) estão com o toggle ligado -> únicas exibidas no mapa
  const [selectedSubvias, setSelectedSubvias] = useState<Set<string>>(new Set());

  function toggleViaExpandida(viaId: string) {
    setViasExpandidas((prev) => {
      const novo = new Set(prev);
      if (novo.has(viaId)) {
        novo.delete(viaId);
      } else {
        novo.add(viaId);
      }
      return novo;
    });
  }

  function toggleSubvia(subviaId: string) {
    setSelectedSubvias((prev) => {
      const novo = new Set(prev);
      if (novo.has(subviaId)) {
        novo.delete(subviaId);
      } else {
        novo.add(subviaId);
      }
      return novo;
    });
  }

  // Regra de exibição no mapa: só aparece a pista (subvia) cujo toggle
  // estiver marcado. Expandir/recolher a via não afeta o que é exibido.
  const subviasVisiveis = useMemo(
    () => Array.from(selectedSubvias),
    [selectedSubvias]
  );

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

          {/* VIA - lista de pistas com toggle individual */}
          <div className="filter">
            <ViaFilter
              viasExpandidas={viasExpandidas}
              selectedSubvias={selectedSubvias}
              onToggleViaExpandida={toggleViaExpandida}
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
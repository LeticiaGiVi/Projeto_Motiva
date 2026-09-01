import MapView from "../componentes/mapa/MapView";

import "./MapPage.css";

export default function MapPage() {
  return (
    <div className="map-page">

      {/* CONTEÚDO */}
      <main className="map-content">

        {/* SIDEBAR */}
        <aside className="map-sidebar">

          <h2>Filtros</h2>


          {/* PERÍODO */}
          <div className="filter">

            <label>
              Período:
            </label>

            <div className="period-buttons">

              <button>
                Hoje
              </button>

              <button className="selected">
                Últimos 7 dias
              </button>

              <button>
                Último mês
              </button>

              <button>
                Personalizado
              </button>

            </div>

          </div>


          {/* VIA */}
          <div className="filter">

            <label>
              Via:
            </label>

            <select defaultValue="RotaSP">

              <option value="RotaSP">
                RotaSP
              </option>

              <option value="Rodovia">
                Rodovia
              </option>

              <option value="Estrada">
                Estrada
              </option>

              <option value="Todos">
                Todos
              </option>

            </select>

          </div>


          {/* EQUIPE */}
          <div className="filter">

            <label>
              Equipe:
            </label>

            <div className="teams">

              <label>
                <input
                  type="checkbox"
                  defaultChecked
                />
                Equipe 1
              </label>

              <label>
                <input type="checkbox" />
                Equipe 2
              </label>

              <label>
                <input type="checkbox" />
                Equipe 3
              </label>

              <label>
                <input type="checkbox" />
                Equipe 4
              </label>

              <label>
                <input type="checkbox" />
                Todos
              </label>

            </div>

          </div>


          {/* SERIEDADE */}
          <div className="filter">

            <label>
              Seriedade:
            </label>

            <div className="severity">

              <button className="critical">
                Crítico
              </button>

              <button className="alert">
                Alerta
              </button>

              <button className="normal">
                Normal
              </button>

            </div>

          </div>


          {/* APLICAR */}
          <button className="apply-button">
            Aplicar Filtros
          </button>

        </aside>


        {/* MAPA */}
        <section className="map-section">

          <MapView />

        </section>

      </main>

    </div>
  );
}
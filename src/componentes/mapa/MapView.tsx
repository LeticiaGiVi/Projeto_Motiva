import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./MapPage.css";

type Coordenada = [number, number];

const centro: Coordenada = [-22.9056, -47.0608];

const rotaVermelha: Coordenada[] = [
    [-22.565, -47.4],
    [-22.65, -47.36],
    [-22.75, -47.25],
    [-22.85, -47.18],
    [-22.9056, -47.0608],
    [-23.0, -47.02],
];

const rotaAmarela: Coordenada[] = [
    [-22.9056, -47.0608],
    [-22.98, -46.98],
    [-23.08, -46.9],
    [-23.18, -46.82],
];

const rotaVerde: Coordenada[] = [
    [-23.08, -46.9],
    [-23.18, -46.84],
    [-23.28, -46.78],
    [-23.36, -46.72],
];

// Corrige os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView() {
    return (
        <div className="map-wrapper">
            <MapContainer
                center={centro}
                zoom={10}
                scrollWheelZoom={true}
                className="map"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* ROTA VERMELHA */}
                <Polyline
                    positions={rotaVermelha}
                    pathOptions={{
                        color: "#d71919",
                        weight: 3,
                    }}
                />

                {/* ROTA AMARELA */}
                <Polyline
                    positions={rotaAmarela}
                    pathOptions={{
                        color: "#e5c400",
                        weight: 4,
                    }}
                />

                {/* ROTA VERDE */}
                <Polyline
                    positions={rotaVerde}
                    pathOptions={{
                        color: "#55b947",
                        weight: 4,
                    }}
                />

                {/* CAMPINAS */}
                <Marker position={centro}>
                    <Popup>
                        <strong>Campinas</strong>
                        <br />
                        Ponto de distribuição
                    </Popup>
                </Marker>

                {/* LIMEIRA */}
                <Marker position={[-22.565, -47.4]}>
                    <Popup>
                        <strong>Limeira</strong>
                        <br />
                        Equipe 1
                    </Popup>
                </Marker>

            </MapContainer>
        </div>
    );
}
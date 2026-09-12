import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { viasData, coresPorVia } from "../../scripts/viasData";
import RodoviaLayer from "./RodoviaLayer";

const centro: [number, number] = [-23.5505, -46.6333]; // São Paulo (capital)

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  subviasVisiveis: string[];
}

export default function MapView({ subviasVisiveis }: MapViewProps) {
  const visiveisSet = new Set(subviasVisiveis);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={centro}
        zoom={9}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {viasData.map((via) =>
          via.subvias
            .filter((subvia) => visiveisSet.has(subvia.id))
            .map((subvia) => (
              <RodoviaLayer
                key={subvia.id}
                via={via}
                subvia={subvia}
                cor={subvia.cor ?? coresPorVia[via.id] ?? "#3388ff"}
              />
            ))
        )}
      </MapContainer>
    </div>
  );
}
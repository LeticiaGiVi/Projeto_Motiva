import { Polyline, Popup } from "react-leaflet";
import { useRodoviaLinhas } from "../../scripts/RodoviaLinhas";
import type { Via, Subvia } from "../../scripts/viasData";

interface RodoviaLayerProps {
  via: Via;
  subvia: Subvia;
  cor: string;
}

export default function RodoviaLayer({ via, subvia, cor }: RodoviaLayerProps) {
  const { linhas, erro } = useRodoviaLinhas(subvia.ref, subvia.bbox);

  if (erro || !linhas) return null;

  return (
    <>
      {linhas.map((linha, indice) => (
        <Polyline
          key={`${subvia.id}-${indice}`}
          positions={linha}
          pathOptions={{ color: cor, weight: 4, opacity: 0.85 }}
        >
          <Popup>
            <strong>{via.nome}</strong>
            <br />
            {subvia.nome}
          </Popup>
        </Polyline>
      ))}
    </>
  );
}
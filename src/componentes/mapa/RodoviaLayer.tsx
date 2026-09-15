import { Fragment, useMemo } from "react";
import { Polyline, CircleMarker, Tooltip } from "react-leaflet";
import { useRodoviaLinhas } from "../../scripts/RodoviaLinhas";
import type { Via, Subvia } from "../../scripts/viasData";
import { pontosACadaKm, type Coordenada } from "../../scripts/geoUtils";
import {
  gerarDadoVegetacao,
  faixaCor,
  rotuloFaixa,
} from "../../scripts/vegetacaoMock";

interface RodoviaLayerProps {
  via: Via;
  subvia: Subvia;
  /** cor de fallback, usada apenas se não houver pontos de km calculados */
  cor: string;
}

interface LinhaProcessada {
  indiceLinha: number;
  /** marcos ordenados: início real da linha + 1 ponto por km + fim real */
  marcos: Coordenada[];
  /** pontos de km com o dado de vegetação já resolvido (para as bolinhas) */
  pontosKm: { posicao: Coordenada; km: number; dado: ReturnType<typeof gerarDadoVegetacao> }[];
}

export default function RodoviaLayer({ via, subvia, cor }: RodoviaLayerProps) {
  const { linhas, erro } = useRodoviaLinhas(subvia.ref, subvia.bbox, subvia.nomeBusca);

  const linhasProcessadas: LinhaProcessada[] = useMemo(() => {
    if (!linhas) return [];

    return linhas.map((linha, indiceLinha) => {
      const kmInicio =
        subvia.trechos?.[indiceLinha]?.kmInicio ?? subvia.trechos?.[0]?.kmInicio ?? 0;

      const pontosKm = pontosACadaKm(linha, 1, kmInicio).map((p) => ({
        ...p,
        dado: gerarDadoVegetacao(subvia.id, p.km),
      }));

      const marcos: Coordenada[] =
        pontosKm.length === 0
          ? [linha[0], linha[linha.length - 1]]
          : [linha[0], ...pontosKm.map((p) => p.posicao), linha[linha.length - 1]];

      return { indiceLinha, marcos, pontosKm };
    });
  }, [linhas, subvia.id, subvia.trechos]);

  if (erro || !linhas) return null;

  return (
    <>
      {linhasProcessadas.map(({ indiceLinha, marcos, pontosKm }) => {
        // cor de cada segmento entre dois marcos consecutivos: usa a
        // vegetação do marco de km que "fecha" aquele pedaço da via
        const corDoSegmento = (indiceSegmento: number): string => {
          if (pontosKm.length === 0) return cor;
          const indicePonto = Math.min(indiceSegmento, pontosKm.length - 1);
          return faixaCor(pontosKm[indicePonto].dado.tamanho);
        };

        return (
          <Fragment key={`${subvia.id}-${indiceLinha}`}>
            {marcos.slice(0, -1).map((ponto, i) => (
              <Polyline
                key={`${subvia.id}-${indiceLinha}-seg-${i}`}
                positions={[ponto, marcos[i + 1]]}
                pathOptions={{ color: corDoSegmento(i), weight: 5, opacity: 0.85 }}
              />
            ))}

            {/* bolinhas a cada km — só existem enquanto esta subvia estiver
                acionada no filtro, pois RodoviaLayer só é montado nesse caso */}
            {pontosKm.map((p, i) => (
              <CircleMarker
                key={`${subvia.id}-${indiceLinha}-pt-${i}`}
                center={p.posicao}
                radius={6}
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: faixaCor(p.dado.tamanho),
                  fillOpacity: 1,
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1} sticky>
                  <div style={{ lineHeight: 1.5, fontSize: 13 }}>
                    <strong>
                      {via.nome} — {subvia.nome}
                    </strong>
                    <br />
                    Km {p.km.toFixed(1)}
                    <br />
                    Vegetação: <strong>{p.dado.tamanho} cm</strong> ({rotuloFaixa(p.dado.tamanho)})
                    <br />
                    {p.dado.tamanho > 15 ? (
                      p.dado.podaAgendada ? (
                        <>
                          Poda agendada: <strong>{p.dado.dataPoda}</strong>
                        </>
                      ) : (
                        "Sem poda agendada"
                      )
                    ) : (
                      "Poda não necessária"
                    )}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
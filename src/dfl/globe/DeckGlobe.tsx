import { useCallback, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import * as DeckCore from '@deck.gl/core';
import { useGlobeStore } from '@/dfl/state/useGlobeStore';
import { BASEMAPS, useBasemapStore } from '@/dfl/state/useUiStore';

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
};

type DroneSite = { name: string; position: [number, number, number?] };

const deckCoreAny = DeckCore as unknown as Record<string, unknown>;
const GlobeViewCtor =
  (deckCoreAny['GlobeView'] as typeof DeckCore.MapView | undefined) ??
  (deckCoreAny['_GlobeView'] as typeof DeckCore.MapView | undefined) ??
  DeckCore.MapView;

const DRONE_SITES: DroneSite[] = [
  { name: 'San Francisco, USA', position: [-122.389, 37.615, 1500] },
  { name: 'Paris, France', position: [2.55, 49.0097, 1200] },
  { name: 'Tokyo, Japan', position: [139.781, 35.549, 900] },
  { name: 'Sydney, Australia', position: [151.1772, -33.9461, 600] }
];

const clampViewState = (state: ViewState): ViewState => ({
  ...state,
  zoom: Math.max(0.2, Math.min(5, state.zoom))
});

export default function DeckGlobe() {
  const viewState = useGlobeStore((state) => state.viewState);
  const setViewState = useGlobeStore((state) => state.setViewState);
  const basemapId = useBasemapStore((state) => state.id);

  const basemap = useMemo(
    () => BASEMAPS.find((candidate) => candidate.id === basemapId) ?? BASEMAPS[0],
    [basemapId]
  );

  const basemapLayer = useMemo(
    () =>
      new TileLayer({
        id: `basemap-${basemap.id}`,
        data: basemap.url,
        minZoom: 0,
        maxZoom: 5,
        tileSize: 256,
        pickable: false,
        renderSubLayers: (props) => {
          const tile = (props as any).tile;
          const bounds = tile?.bbox ?? (props as any).bbox;
          if (!bounds) {
            return null;
          }
          const { west, south, east, north } = bounds;
          return new BitmapLayer(props, {
            id: `${props.id}-bitmap`,
            image: (props as any).data,
            bounds: [west, south, east, north]
          });
        }
      }),
    [basemap]
  );

  const droneLayer = useMemo(
    () =>
      new ScatterplotLayer<DroneSite>({
        id: 'drone-sites',
        data: DRONE_SITES,
        getPosition: (site) => site.position,
        getRadius: 40000,
        radiusUnits: 'meters',
        getFillColor: [255, 140, 0, 220],
        getLineColor: [0, 0, 0, 200],
        lineWidthUnits: 'pixels',
        getLineWidth: 2,
        stroked: true,
        pickable: true
      }),
    []
  );

  const handleViewStateChange = useCallback(
    ({ viewState: next }: { viewState: ViewState }) => {
      setViewState(clampViewState(next));
    },
    [setViewState]
  );

  const getTooltip = useCallback((info: { object?: DroneSite | null }) => {
    if (!info.object) {
      return null;
    }
    return { text: info.object.name };
  }, []);

  return (
    <div className="absolute inset-0">
      <DeckGL
        views={new (GlobeViewCtor as any)()}
        controller={{
          dragPan: true,
          dragRotate: true,
          scrollZoom: { speed: 0.005, smooth: true },
          touchZoom: true,
          touchRotate: true,
          doubleClickZoom: false
        }}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        layers={[basemapLayer, droneLayer]}
        getTooltip={getTooltip as any}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}

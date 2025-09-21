import { DeckGL } from '@deck.gl/react';
import * as DeckCore from '@deck.gl/core';
import { ScatterplotLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { useMemo, useRef, useCallback } from 'react';
import { useGlobeStore } from '@/dfl/state/useGlobeStore';
import { BASEMAPS, useBasemapStore } from '@/dfl/state/useUiStore';

const GlobeViewCtor =
  (DeckCore as any).GlobeView ?? (DeckCore as any)._GlobeView ?? DeckCore.MapView;

function clampZoom(v: any, min = 0.2, max = 5) {
  return { ...v, zoom: Math.max(min, Math.min(max, v.zoom ?? 0)) };
}

export default function DeckGlobe() {
  const viewState = useGlobeStore((s) => s.viewState);
  const setViewState = useGlobeStore((s) => s.setViewState);
  const basemapId = useBasemapStore((s) => s.id);
  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

  const onWheelCapture = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) { e.preventDefault(); e.stopPropagation(); }
  }, []);

  const base = useMemo(
    () =>
      new TileLayer({
        id: `base-tiles-${basemap.id}`,
        data: basemap.url,
        minZoom: 0,
        maxZoom: 5,
        tileSize: 256,
        renderSubLayers: (props) => {
          const bbox = (props as any).bbox ?? (props as any).tile?.bbox;
          if (!bbox) return null;
          const { west, south, east, north } = bbox;
          return new BitmapLayer({ id: `bitmap-${(props as any).tile?.id ?? Math.random()}` } as any, {
            data: null,
            bounds: [west, south, east, north],
            image: (props as any).data
          });
        }
      }),
    [basemap]
  );

  const drones = useMemo(
    () =>
      new ScatterplotLayer({
        id: 'drones',
        data: [
          { position: [-122.389, 37.615, 1500] },
          { position: [2.55, 49.0097, 1200] },
          { position: [139.781, 35.549, 900] }
        ],
        getPosition: (d) => d.position,
        getRadius: 30000,
        radiusUnits: 'meters',
        pickable: true
      }),
    []
  );

  return (
    <div
      onWheelCapture={onWheelCapture}
      style=
            {{
              position: 'absolute',
              inset: 0,
              zIndex: 0,              // 👈 keep globe underneath overlays
              touchAction: 'none',
              overscrollBehavior: 'none'
            }}
    >
      <DeckGL
        views={new (GlobeViewCtor as any)()}
        viewState={viewState}
        onViewStateChange={({ viewState }: { viewState: any }) => setViewState(clampZoom(viewState))}
        controller={{
          dragPan: true,
          dragRotate: true,
          inertia: 200,
          scrollZoom: { speed: 0.005, smooth: true },
          doubleClickZoom: false,
          touchZoomRotate: true
        }}
        layers={[base, drones]}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }} // 👈
        />
    </div>
  );
}

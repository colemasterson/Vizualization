import { DeckGL } from '@deck.gl/react';
import * as DeckCore from '@deck.gl/core';
import { ScatterplotLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { useMemo } from 'react';
import { useGlobeStore } from '@/dfl/state/useGlobeStore';

const GlobeViewCtor =
  (DeckCore as any).GlobeView ??
  (DeckCore as any)._GlobeView ??
  DeckCore.MapView;

// Some deck.gl versions export GlobeView, others export _GlobeView (experimental), and
// older ones don’t have it at all. Fall back to MapView in that case.


const RASTER_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function DeckGlobe() {
  const viewState = useGlobeStore((s) => s.viewState);
  const setViewState = useGlobeStore((s) => s.setViewState);

  const base = useMemo(
    () =>
      new TileLayer({
        id: 'base-tiles',
        data: RASTER_URL,
        minZoom: 0,
        maxZoom: 5,
        tileSize: 256,
        renderSubLayers: (props) => {
          // Support both shapes depending on deck.gl version
          const bbox = (props as any).bbox ?? (props as any).tile?.bbox;
          if (!bbox) return null;
  
          const { west, south, east, north } = bbox;
  
          return new BitmapLayer(
            // Important: do NOT inherit 'data' from TileLayer
            { id: `bitmap-${(props as any).tile?.id ?? Math.random()}` } as any,
            {
              data: null, // 👈 prevent deck from treating image as iterable
              bounds: [west, south, east, north],
              image: (props as any).data
            }
          );
        }
      }),
    []
  );
  



  const drones = useMemo(
    () =>
      new ScatterplotLayer({
        id: 'drones',
        data: [
          { position: [-122.389, 37.615, 1500] }, // SFO
          { position: [2.55, 49.0097, 1200] },   // CDG
          { position: [139.781, 35.549, 900] }   // HND
        ],
        getPosition: (d) => d.position,
        getRadius: 30000,
        radiusUnits: 'meters',
        pickable: true
      }),
    []
  );

  return (
    <DeckGL
      // Use GlobeView if available, otherwise MapView (still works; just not a 3D sphere)
      views={new (GlobeViewCtor as any)()}
      controller={true}
      viewState={viewState}
      onViewStateChange={({ viewState }: { viewState: any }) => setViewState(viewState)}
      layers={[base, drones]}
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}

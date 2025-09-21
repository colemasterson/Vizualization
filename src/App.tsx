import DeckGlobe from '@/dfl/globe/DeckGlobe';
import { BASEMAPS, useBasemapStore } from '@/dfl/state/useUiStore';

export default function App() {
  return (
    <div className="h-screen w-screen relative">
      <DeckGlobe />

      {/* ↑ UI overlay sits above the globe */}
      <div
        className="absolute top-4 left-4 z-20 pointer-events-auto space-y-2
                   rounded-xl border border-white/10 bg-white/10 p-3 text-sm backdrop-blur"
        style={{ cursor: 'default' }}
      >
        <div className="font-semibold">Drone Globe (deck.gl)</div>
        <div className="text-white/70">Drag to rotate • Scroll to zoom • Shift+drag to pan</div>
        <BasemapSelect />
      </div>

      {/* Attribution footer above globe too */}
      <div className="absolute bottom-2 left-2 z-20 pointer-events-auto">
        <Attribution />
      </div>
    </div>
  );
}

function BasemapSelect() {
  const { id, setId } = useBasemapStore();
  return (
    <label className="flex items-center gap-2">
      <span>Basemap:</span>
      <select
        className="bg-black/40 border border-white/20 rounded px-2 py-1"
        value={id}
        onChange={(e) => setId(e.target.value as any)}
      >
        {BASEMAPS.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Attribution() {
  const { id } = useBasemapStore();
  const meta = BASEMAPS.find((b) => b.id === id);
  return (
    <div className="rounded bg-black/40 px-2 py-1 text-[11px] text-white/70">
      {meta?.attribution}
    </div>
  );
}

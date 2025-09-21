import DeckGlobe from '@/dfl/globe/DeckGlobe';

export default function App() {
  return (
    <div className="h-screen w-screen relative">
      <DeckGlobe />
      <div className="absolute top-4 left-4 rounded-xl border border-white/10 bg-white/10 p-3 text-sm">
        <div className="font-semibold">Drone Globe (deck.gl)</div>
        <div className="text-white/70">Drag to rotate • Scroll to zoom • Shift+drag to pan</div>
      </div>
    </div>
  );
}

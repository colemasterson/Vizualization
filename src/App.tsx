import DeckGlobe from '@/dfl/globe/DeckGlobe';
import { BASEMAPS, useBasemapStore } from '@/dfl/state/useUiStore';
import type { BasemapId } from '@/dfl/state/useUiStore';
import type {
  PointerEvent,
  TouchEvent,
  WheelEvent
} from 'react';

const blockPointer = (event: PointerEvent<HTMLElement>) => {
  event.stopPropagation();
};

const blockTouch = (event: TouchEvent<HTMLElement>) => {
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
};

const blockWheel = (event: WheelEvent<HTMLElement>) => {
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
};

export default function App() {
  const handlePointerCapture: PointerEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  const handleTouchCapture: TouchEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  const handleWheelCapture: WheelEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <DeckGlobe />
      <UiOverlay />
    </div>
  );
}

function UiOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <div className="pointer-events-auto p-6">
          <ControlPanel />
        </div>
        <div className="pointer-events-auto mt-auto p-4">
          <Attribution />
        </div>
      </div>
    </>
  );
}

function ControlPanel() {
  return (
    <div
      className="max-w-xs rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
      onPointerDownCapture={blockPointer}
      onPointerMoveCapture={blockPointer}
      onPointerUpCapture={blockPointer}
      onTouchStartCapture={blockTouch}
      onTouchMoveCapture={blockTouch}
      onTouchEndCapture={blockTouch}
      onWheelCapture={blockWheel}
    >
      <div className="space-y-3">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-white">Drone Flight Lab</h1>
          <p className="text-xs text-white/70">
            Explore the interactive globe, drag to rotate, scroll or pinch to zoom, and shift-drag to
            pan.
          </p>
        </header>
        <BasemapSelect />
      </div>
    </div>
  );
}

function BasemapSelect() {
  const { id, setId } = useBasemapStore();

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-white/80">Basemap</span>
      <select
        className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white shadow-inner"
        value={id}
        onChange={(event) => setId(event.target.value as BasemapId)}
        onPointerDownCapture={blockPointer}
        onPointerUpCapture={blockPointer}
        onTouchStartCapture={blockTouch}
        onTouchEndCapture={blockTouch}
        onWheelCapture={blockWheel}
      >
        {BASEMAPS.map((basemap) => (
          <option key={basemap.id} value={basemap.id} className="bg-slate-900 text-white">
            {basemap.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Attribution() {
  const { id } = useBasemapStore();
  const basemap = BASEMAPS.find((candidate) => candidate.id === id) ?? BASEMAPS[0];

  return (
    <div className="w-fit rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] text-white/70">
      {basemap.attribution}
    </div>
  );
}

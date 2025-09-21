import { create } from 'zustand';

type ViewState = { longitude: number; latitude: number; zoom: number; pitch: number; bearing: number };
type GlobeState = { viewState: ViewState; setViewState: (v: Partial<ViewState>) => void };

export const useGlobeStore = create<GlobeState>((set) => ({
  viewState: { longitude: 0, latitude: 20, zoom: 0.8, pitch: 0, bearing: 0 },
  setViewState: (v) => set((s) => ({ viewState: { ...s.viewState, ...v } })),
}));

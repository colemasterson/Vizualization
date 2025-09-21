import { create } from 'zustand';

export type BasemapId = 'osm' | 'positron' | 'dark' | 'esri-img' | 'esri-relief';

export const BASEMAPS: { id: BasemapId; name: string; url: string; attribution: string }[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  {
    id: 'positron',
    name: 'Carto Positron (Light)',
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© CARTO'
  },
  {
    id: 'dark',
    name: 'Carto Dark Matter',
    url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '© CARTO'
  },
  {
    id: 'esri-img',
    name: 'Esri World Imagery',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Source: Esri & contributors'
  },
  {
    id: 'esri-relief',
    name: 'Esri Shaded Relief',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Source: Esri'
  }
];

export const useBasemapStore = create<{ id: BasemapId; setId: (id: BasemapId) => void }>((set) => ({
  id: 'osm',
  setId: (id) => set({ id })
}));

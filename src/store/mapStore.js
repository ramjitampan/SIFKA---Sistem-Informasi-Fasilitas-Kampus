import { create } from 'zustand';

const useMapStore = create((set) => ({
  center: [-0.9500, 100.3800],
  zoom: 16,
  
  setMapState: (center, zoom) => set({ center, zoom }),
}));

export default useMapStore;

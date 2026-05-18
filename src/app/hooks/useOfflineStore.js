// Zustand store to manage online/offline state
import create from 'zustand';

const useOfflineStore = create((set) => ({
  isOnline: navigator.onLine,
  cachedActions: [],

  setOnlineStatus: (status) => set({ isOnline: status }),

  cacheAction: (action) =>
    set((state) => ({ cachedActions: [...state.cachedActions, action] })),

  clearCachedActions: () => set({ cachedActions: [] }),
}));

// Listen for online/offline events
window.addEventListener('online', () => useOfflineStore.getState().setOnlineStatus(true));
window.addEventListener('offline', () => useOfflineStore.getState().setOnlineStatus(false));

export default useOfflineStore;

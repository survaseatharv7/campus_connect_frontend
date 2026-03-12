import { create } from 'zustand'

const useUIStore = create((set) => ({
  sidebarOpen: true,
  sidebarMobileOpen: false,
  globalLoading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleMobileSidebar: () => set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
  setMobileSidebarOpen: (open) => set({ sidebarMobileOpen: open }),

  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}))

export default useUIStore

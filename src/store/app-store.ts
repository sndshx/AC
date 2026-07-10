import { create } from "zustand";

type AppState = {
  sidebarOpen: boolean;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  searchQuery: "",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query })
}));

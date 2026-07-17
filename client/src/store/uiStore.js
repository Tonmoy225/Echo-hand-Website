import { create } from "zustand";

export const useUIStore = create((set) => ({
  activeModal: null, // 'profile' | 'createPost' | 'terms' | 'feedback' | 'report' | 'logout' | 'notifications' | 'cart'
  modalProps: {},

  openModal: (name, props = {}) => set({ activeModal: name, modalProps: props }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),

  activeCategory: "All",
  setActiveCategory: (cat) => set({ activeCategory: cat }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

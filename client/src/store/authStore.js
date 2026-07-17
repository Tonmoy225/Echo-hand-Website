import { create } from "zustand";
import { loginApi, registerApi, logoutApi, getMeApi } from "../api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  authModalView: "login", // 'login' | 'signup'

  openAuthModal: (view = "login") => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthView: (view) => set({ authModalView: view }),

  init: async () => {
    const token = localStorage.getItem("ecohand_token");
    if (!token) return set({ loading: false });
    try {
      const { data } = await getMeApi();
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem("ecohand_token");
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem("ecohand_token", data.token);
    set({ user: data, isAuthModalOpen: false });
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await registerApi({ name, email, password });
    localStorage.setItem("ecohand_token", data.token);
    set({ user: data, isAuthModalOpen: false });
    return data;
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("ecohand_token");
    set({ user: null });
  },

  updateUserLocal: (patch) => set({ user: { ...get().user, ...patch } }),
}));

import { create } from "zustand";
import { api } from "../api/client";

export const useAuth = create((set) => ({
  token: localStorage.getItem("spool_token"),
  member: JSON.parse(localStorage.getItem("spool_member") || "null"),

  async login(username, password) {
    const data = await api.login(username, password);
    localStorage.setItem("spool_token", data.access_token);
    localStorage.setItem("spool_member", JSON.stringify(data.member));
    set({ token: data.access_token, member: data.member });
  },

  logout() {
    localStorage.removeItem("spool_token");
    localStorage.removeItem("spool_member");
    set({ token: null, member: null });
  },
}));

import { create } from "zustand";
import { api } from "../api/client";

export const useSpoolStore = create((set, get) => ({
  members: [],
  filaments: [],
  ledger: [],
  dashboard: null,
  currency: "kr",
  loaded: false,

  async refreshAll() {
    const [members, filaments, ledger, dashboard, config] = await Promise.all([
      api.members(),
      api.filaments(),
      api.ledger(),
      api.dashboard(),
      api.config(),
    ]);
    set({ members, filaments, ledger, dashboard, currency: config.currency, loaded: true });
  },
  refreshMembers: async () => set({ members: await api.members() }),
  refreshFilaments: async () => set({ filaments: await api.filaments() }),
  refreshLedger: async () => set({ ledger: await api.ledger() }),
  refreshDashboard: async () => set({ dashboard: await api.dashboard() }),

  async logPrint(memberId, filamentId, grams) {
    await api.logPrint(memberId, filamentId, grams);
    await Promise.all([
      get().refreshMembers(),
      get().refreshFilaments(),
      get().refreshLedger(),
      get().refreshDashboard(),
    ]);
  },
  async creditMember(memberId, grams, note) {
    await api.creditMember(memberId, grams, note);
    await Promise.all([get().refreshMembers(), get().refreshLedger(), get().refreshDashboard()]);
  },
  async markPaid(debtorId, creditorId) {
    await api.markPaid(debtorId, creditorId);
    await get().refreshMembers();
  },
  async createFilament(data) {
    await api.createFilament(data);
    await Promise.all([get().refreshFilaments(), get().refreshDashboard()]);
  },
}));

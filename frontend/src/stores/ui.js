import { create } from "zustand";

// Which modal is open: null | "print" | "credit" | "spool"
export const useModalStore = create((set) => ({
  modal: null,
  creditPreset: null,
  open: (modal, creditPreset = null) => set({ modal, creditPreset }),
  close: () => set({ modal: null, creditPreset: null }),
}));

import { create } from "zustand";

export const useContentStore = create ((set) => ({
    contentType: "movie",
    setContentType: (contentType) => set({ contentType }),
}))
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  isCamera: boolean;
  bgFile: FileList | null;
  bgFileType: "video" | "image" | "both";
  allowMultipleBgFiles: boolean;
  screenFile: File | null;
  screenColor: "red" | "green" | "blue";
  screenFileType: "video" | "image";
  cameraPos: "front" | "back";
};

type Action = {
  setIsCamera: () => void;
  setBgFile: (bgFile: State["bgFile"]) => void;
  setBgFileType: (bgFileType: State["bgFileType"]) => void;
  setAllowMultipleBgFiles: () => void;
  setScreenFile: (screenFile: State["screenFile"]) => void;
  setScreenColor: (screenColor: State["screenColor"]) => void;
  setScreenFileType: (screenFileType: State["screenFileType"]) => void;
  setCameraPos: (cameraPos: State["cameraPos"]) => void;
};

export const useAppStore = create<State & Action>()(
  persist(
    (set, get) => ({
      isCamera: false,
      bgFile: null,
      bgFileType: "video",
      allowMultipleBgFiles: true,
      screenFile: null,
      screenColor: "green",
      screenFileType: "video",
      cameraPos: "back",
      setIsCamera: () => set({ isCamera: !get().isCamera }),
      setBgFile: (value: FileList | null) => set({ bgFile: value }),
      setBgFileType: (type: "video" | "image" | "both") =>
        set({ bgFileType: type }),
      setAllowMultipleBgFiles: () =>
        set({ allowMultipleBgFiles: !get().allowMultipleBgFiles }),
      setScreenFile: (value: File | null) => set({ screenFile: value }),
      setScreenColor: (color: "red" | "green" | "blue") =>
        set({ screenColor: color }),
      setScreenFileType: (type: "video" | "image") =>
        set({ screenFileType: type }),
      setCameraPos: (pos: "front" | "back") => set({ cameraPos: pos }),
    }),
    {
      name: "gsr-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["bgFile", "screenFile"].includes(key)
          )
        ),
    }
  )
);

import { create } from "zustand";

type State = {
  bgVideo: File | null;
  greenSVideo: File | null;
  isCamera: boolean;
};

type Action = {
  setBgVideo: (bgVideo: State["bgVideo"]) => void;
  setGreenSVideo: (greenSVideo: State["greenSVideo"]) => void;
  setIsCamera: (isCamera: State["isCamera"]) => void;
};

export const useAppStore = create<State & Action>((set) => ({
  bgVideo: null,
  greenSVideo: null,
  isCamera: true,
  setBgVideo: (vid: File | null) => set(() => ({ bgVideo: vid })),
  setGreenSVideo: (vid: File | null) => set(() => ({ greenSVideo: vid })),
  setIsCamera: (bool: boolean) => set(() => ({ isCamera: bool })),
}));

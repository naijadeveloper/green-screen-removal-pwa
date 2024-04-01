import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { IoSettingsSharp } from "react-icons/io5";
import { Slider } from "./slider";
import { useRef } from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { useAppStore } from "../zustland/store";

export default function HomeRouteDialog() {
  const contentRef = useRef<HTMLDivElement>(null);

  // states
  const screenFileType = useAppStore((state) => state.screenFileType);
  const bgFileType = useAppStore((state) => state.bgFileType);
  const screenFile = useAppStore((state) => state.screenFile);
  const bgFile = useAppStore((state) => state.bgFile);
  const allowMultipleBgFiles = useAppStore(
    (state) => state.allowMultipleBgFiles
  );
  const cameraPos = useAppStore((state) => state.cameraPos);
  const screenColor = useAppStore((state) => state.screenColor);

  // actions
  const setScreenFileType = useAppStore((state) => state.setScreenFileType);
  const setBgFileType = useAppStore((state) => state.setBgFileType);
  const setScreenFile = useAppStore((state) => state.setScreenFile);
  const setBgFile = useAppStore((state) => state.setBgFile);
  const setAllowMultipleBgFiles = useAppStore(
    (state) => state.setAllowMultipleBgFiles
  );
  const setCameraPos = useAppStore((state) => state.setCameraPos);
  const setScreenColor = useAppStore((state) => state.setScreenColor);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="group absolute top-0 right-3 pt-4 flex items-center justify-center gap-x-3 cursor-pointer">
          <span className="absolute -left-[92px] bg-neutral-900 p-px px-2 rounded-md after:content-[' '] after:absolute after:top-[20%] after:-right-[15px] after:-ml-[8px] after:border-[8px] after:border-transparent after:border-l-neutral-900 animate-[bounce-x_1s_infinite] group-hover:animate-none">
            Settings
          </span>
          <span className="text-xl">
            <IoSettingsSharp />
          </span>
        </div>
      </DialogTrigger>
      <DialogContent
        ref={contentRef}
        className="w-[95%] max-h-[90%] overflow-auto select-none [&::-webkit-scrollbar-track]:bg-neutral-800 border-2 border-neutral-400"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">GSR Settings</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Change the color of screen, the screen / background file type and
            the camera position.
          </DialogDescription>
        </DialogHeader>
        <div className="divide-y-2 divide-neutral-600/30">
          {/* change color of the screen */}
          <div className="mb-5 pt-4">
            <h3 className="mb-3 font-semibold text-lg">
              Color of screen{" "}
              <span className="text-xs">
                (default is <span className="text-green-600">green</span>)
              </span>
            </h3>
            <div className="flex items-center justify-center gap-x-8">
              <div className="flex flex-col items-center justify-center gap-y-1">
                <button
                  onClick={() => setScreenColor("red")}
                  className={cn(
                    "w-10 h-10 rounded-full bg-red-600 outline-offset-2 outline-neutral-200 outline-2 hover:outline-double",
                    { "outline-double": screenColor == "red" }
                  )}
                ></button>
                <span>Red</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-1">
                <button
                  onClick={() => setScreenColor("green")}
                  className={cn(
                    "w-10 h-10 rounded-full bg-green-600 outline-offset-2 outline-neutral-200 outline-2 hover:outline-double",
                    { "outline-double": screenColor == "green" }
                  )}
                ></button>
                <span>Green</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-1">
                <button
                  onClick={() => setScreenColor("blue")}
                  className={cn(
                    "w-10 h-10 rounded-full bg-blue-600 outline-offset-2 outline-neutral-200 outline-2 hover:outline-double",
                    { "outline-double": screenColor == "blue" }
                  )}
                ></button>
                <span>Blue</span>
              </div>
            </div>
          </div>

          {/* screen file type */}
          <div className="mb-5 pt-4">
            <h3 className="mb-3 font-semibold text-lg">Screen file type</h3>
            <div className="flex items-center justify-between">
              <div className="flex gap-x-3">
                <input
                  id="screen-video"
                  onChange={() => {
                    if (
                      screenFile &&
                      screenFile?.type.toLowerCase().includes("image")
                    ) {
                      setScreenFile(null);
                    }
                    setScreenFileType("video");
                  }}
                  checked={screenFileType == "video"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="screen-video">Video</label>
              </div>

              <div className="flex gap-x-3">
                <input
                  id="screen-image"
                  onChange={() => {
                    if (
                      screenFile &&
                      screenFile?.type.toLowerCase().includes("video")
                    ) {
                      setScreenFile(null);
                    }
                    setScreenFileType("image");
                  }}
                  checked={screenFileType == "image"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="screen-image">Image</label>
              </div>
            </div>
          </div>

          {/* Background File */}
          <div className="mb-5 pt-4">
            <h3 className="mb-3 font-semibold text-lg">Background file type</h3>
            <div className="flex items-center justify-between">
              <div className="flex gap-x-3">
                <input
                  id="file-type-video"
                  onChange={() => {
                    if (
                      bgFile &&
                      Array.from(bgFile).find((file) =>
                        file.type.toLowerCase().includes("image")
                      )
                    ) {
                      setBgFile(null);
                    }
                    setBgFileType("video");
                  }}
                  checked={bgFileType == "video"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="file-type-video">Video</label>
              </div>

              <div className="flex gap-x-3">
                <input
                  id="file-type-image"
                  onChange={() => {
                    if (
                      bgFile &&
                      Array.from(bgFile).find((file) =>
                        file.type.toLowerCase().includes("video")
                      )
                    ) {
                      setBgFile(null);
                    }
                    setBgFileType("image");
                  }}
                  checked={bgFileType == "image"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="file-type-image">Image</label>
              </div>

              <div className="flex gap-x-3">
                <input
                  id="file-type-both"
                  onChange={() => {
                    setBgFileType("both");
                    if (!allowMultipleBgFiles) {
                      setAllowMultipleBgFiles();
                    }
                  }}
                  checked={bgFileType == "both"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="file-type-both">Both</label>
              </div>
            </div>
            <div className="mt-5">
              <label
                htmlFor="allow-multiple"
                className="flex gap-x-2 sm:items-center cursor-pointer"
              >
                <input
                  onChange={() => {
                    if (allowMultipleBgFiles && bgFileType == "both") {
                      setBgFileType("image");
                    }
                    setAllowMultipleBgFiles();
                  }}
                  checked={allowMultipleBgFiles}
                  id="allow-multiple"
                  type="checkbox"
                  className="peer relative appearance-none w-5 h-5 bg-neutral-800 border border-neutral-600 rounded-md shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none max-[404px]:mt-[2px]"
                />

                <span className="text-sm font-medium text-neutral-300">
                  Allow selection of multiple background files
                </span>

                <svg
                  className="absolute w-5 h-5 pointer-events-none hidden peer-checked:block text-primary-foreground max-[404px]:mt-[2px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </label>
            </div>
          </div>

          {/* Camera Position */}
          <div className="pt-4">
            <h3 className="mb-3 font-semibold text-lg">Camera position</h3>
            <div className="flex items-center justify-between">
              <div className="flex gap-x-3">
                <input
                  id="front-cam"
                  onChange={() => setCameraPos("front")}
                  checked={cameraPos == "front"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="front-cam">Front</label>
              </div>

              <div className="flex gap-x-3">
                <input
                  id="back-cam"
                  onChange={() => setCameraPos("back")}
                  checked={cameraPos == "back"}
                  type="radio"
                  className="appearance-none w-6 h-6 bg-neutral-800 border-2 border-neutral-600 rounded-full shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
                />
                <label htmlFor="back-cam">Back</label>
              </div>
            </div>
            <p className="text-neutral-400 text-xs mt-2">
              Please note that, if your device does not support the option
              selected, it will ignore and use the camera available
            </p>
          </div>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

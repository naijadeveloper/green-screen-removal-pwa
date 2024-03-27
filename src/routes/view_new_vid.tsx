import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../zustland/store";
import { screenRemoval } from "../lib/vmv-route-functions";
import BottomSheet from "../components/bottom-sheet";
import Tolerance from "../components/tolerance-dropdown";

export default function ViewNewVideo() {
  // navigation
  const navigate = useNavigate();

  // states
  const isCamera = useAppStore((state) => state.isCamera);
  const screenColor = useAppStore((state) => state.screenColor);
  const bgFile = useAppStore((state) => state.bgFile);
  const screenFile = useAppStore((state) => state.screenFile);
  const [bgFileObj, setBgFileObj] = useState({
    url: URL.createObjectURL(bgFile ? bgFile[0] : new Blob()),
    fileType:
      bgFile && bgFile[0].type.toLowerCase().includes("video")
        ? "video"
        : "image",
  });
  const [screenFileObj, _] = useState({
    url: URL.createObjectURL(screenFile ? screenFile : new Blob()),
    fileType:
      screenFile && screenFile!.type.toLowerCase().includes("video")
        ? "video"
        : "image",
  });
  const [tolerance, setTolerance] = useState(50);
  const [indexOfSelectedBgFile, setIndexOfSelectedBgFile] = useState(0);

  // refs
  const bgFileElem = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const screenFileElem = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const mainElem = useRef<HTMLElement>(null);
  const bgCanvas = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  function handleBgSelection(index: number) {
    setIndexOfSelectedBgFile(() => index);

    // release from memory, previous file url
    URL.revokeObjectURL(bgFileObj.url);

    // get file from bgFile
    let file = bgFile![index];
    setBgFileObj(() => ({
      url: URL.createObjectURL(file),
      fileType: file.type.toLowerCase().includes("video") ? "video" : "image",
    }));
  }

  // main useEffect
  useEffect(() => {
    // navigate away from page, if any of these is missing
    if (isCamera || !bgFile || bgFile.length == 0 || !screenFile) {
      navigate("/");
      return;
    }

    // call color screen removal fn
    let screenRemovalRes: Record<string, any> = screenRemoval(
      screenFileObj,
      bgFileObj,
      screenFileElem,
      bgFileElem,
      bgCanvas,
      canvas,
      tolerance,
      screenColor
    );

    return () => {
      if (!screenFileElem.current || !bgFileElem.current || !screenRemovalRes) {
        return;
      }

      // cancel animation frames
      if (screenRemovalRes.anime1)
        cancelAnimationFrame(screenRemovalRes.anime1);
      if (screenRemovalRes.anime2)
        cancelAnimationFrame(screenRemovalRes.anime2);

      // clear the canvases
      screenRemovalRes.ctx.clearRect(
        0,
        0,
        canvas.current!.width,
        canvas.current!.height
      );
      screenRemovalRes.bgCtx.clearRect(
        0,
        0,
        canvas.current!.width,
        canvas.current!.height
      );

      // remove the source from both elements
      screenFileElem.current!.removeAttribute("src");
      bgFileElem.current!.removeAttribute("src");
    };
  }, [bgFileObj, tolerance]);

  return (
    <>
      <main
        ref={mainElem}
        className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto overflow-hidden rounded-lg flex flex-col items-center justify-center text-neutral-200"
      >
        {/* render, based on the type of bg file selected */}
        {bgFile && bgFileObj.fileType == "video" ? (
          <video
            ref={bgFileElem as React.RefObject<HTMLVideoElement>}
            src=""
            autoPlay
            loop
            muted
            className="invisible absolute"
          />
        ) : (
          <img
            ref={bgFileElem as React.RefObject<HTMLImageElement>}
            src=""
            className="invisible absolute"
          />
        )}

        {/* render, based on the type of screen file */}
        {screenFile && screenFile.type.toLowerCase().includes("video") ? (
          <video
            ref={screenFileElem as React.RefObject<HTMLVideoElement>}
            src=""
            autoPlay
            loop
            muted
            className="invisible absolute h-full w-full"
          />
        ) : (
          <img
            ref={screenFileElem as React.RefObject<HTMLImageElement>}
            src=""
            alt={screenFile?.name}
            className="invisible absolute h-full w-full"
          />
        )}

        <canvas ref={bgCanvas} className="invisible absolute"></canvas>
        <canvas ref={canvas} className="absolute rounded-lg"></canvas>
      </main>
      <div className="flex gap-x-4">
        {bgFile && bgFile!.length > 1 && (
          <BottomSheet
            bgFile={bgFile as FileList}
            selection={indexOfSelectedBgFile}
            handleBgSelection={handleBgSelection}
          />
        )}

        <Tolerance tolerance={tolerance} setTolerance={setTolerance} />
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../zustland/store";
import { screenRemoval } from "../lib/vmv-route-functions";
import RightDrawer from "../components/right-drawer";

export default function ViewNewVideo() {
  // navigation
  const navigate = useNavigate();

  // ...states
  // local
  const [loading, setLoading] = useState(true);
  const [showColorScreen, setShowColorScreen] = useState(false);
  const [indexOfSelectedBgFile, setIndexOfSelectedBgFile] = useState(0);

  // global
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

  // refs
  const bgFileElem = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const screenFileElem = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const mainElem = useRef<HTMLElement>(null);

  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  function handleBgSelection(index: number) {
    setIndexOfSelectedBgFile(() => index);

    // get file from bgFile
    let file = bgFile![index];

    // reset the bgFileObj
    setBgFileObj(() => ({
      url: URL.createObjectURL(file),
      fileType: file.type.toLowerCase().includes("video") ? "video" : "image",
    }));
  }

  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  function handleImageDownload() {
    const canvas = document.querySelector("#screencanvas") as HTMLCanvasElement;
    const pngDataUrl = canvas!.toDataURL("image/png");

    // create anchor tag
    const download = document.createElement("a") as HTMLAnchorElement;
    download.classList.add("invisible", "absolute");
    download.download = "gsr-image.png";
    download.href = pngDataUrl;

    // append to parent
    mainElem.current!.append(download);

    // trigger click
    download.click();
  }

  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // loading
    setLoading(true);

    // navigate away from page, if any of these is missing
    if (isCamera || !bgFile || bgFile.length == 0 || !screenFile) {
      navigate("/");
      return;
    }

    // remove previous screen / background file canvas instances if they exist
    if (document.querySelector("#screencanvas")) {
      mainElem.current?.removeChild(document.querySelector("#screencanvas")!);
    }
    if (document.querySelector("#bgcanvas")) {
      mainElem.current?.removeChild(document.querySelector("#bgcanvas")!);
    }

    // create the screen file canvas and background file canvas
    const canvas = document.createElement("canvas");
    canvas.classList.add("absolute", "rounded-lg");
    canvas.id = "screencanvas";

    const bgCanvas = document.createElement("canvas");
    bgCanvas.classList.add("absolute", "rounded-lg", "invisible");
    bgCanvas.id = "bgcanvas";

    // append both to main element parent
    mainElem.current?.append(canvas!, bgCanvas!);

    // call color screen removal fn
    let screenRemovalRes: Record<string, any> = screenRemoval(
      screenFileObj,
      bgFileObj,
      screenFileElem,
      bgFileElem,
      bgCanvas,
      canvas,
      showColorScreen,
      screenColor
    );

    // if the ctx and bgCtx are returned = it worked, so remove set loading to false
    if (screenRemovalRes.ctx && screenRemovalRes.bgCtx) {
      setTimeout(() => setLoading(false), 3000);
    }

    // clean ups, removing the animation frames
    return () => {
      if (!screenFileElem.current || !bgFileElem.current) {
        return;
      }

      // cancel animation frames
      if (screenRemovalRes.anime1) {
        cancelAnimationFrame(screenRemovalRes.anime1);
      }

      if (screenRemovalRes.anime2) {
        cancelAnimationFrame(screenRemovalRes.anime2);
      }
    };
  }, [bgFileObj, showColorScreen]);

  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {screenFile && bgFile && (
        <button
          onClick={() => handleImageDownload()}
          className="relative bg-primary text-primary-foreground px-2 py-1 rounded-md border-b-4 border-neutral-700 hover:border-neutral-800 hover:bg-primary/90"
        >
          Save Image
        </button>
      )}

      {/*  */}
      {screenFile && bgFile && loading && (
        <div className="absolute w-full h-full top-0 left-0 bg-neutral-900 z-50 flex items-center justify-center">
          <p className="font-bold text-lg bg-neutral-200 px-2">
            Loading please wait...
          </p>
        </div>
      )}

      {/*  */}
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
      </main>

      {/*  */}
      <div className="flex gap-x-4">
        {bgFile && bgFile!.length > 1 && (
          <RightDrawer
            bgFile={bgFile as FileList}
            selection={indexOfSelectedBgFile}
            handleBgSelection={handleBgSelection}
          />
        )}

        {/*  */}
        {bgFile && screenFile && (
          <label
            htmlFor="show-color-screen"
            className="flex gap-x-2 sm:items-center cursor-pointer text-neutral-200 bg-neutral-700 px-2 py-1 rounded-md"
          >
            <input
              onChange={() => setShowColorScreen(!showColorScreen)}
              checked={showColorScreen}
              id="show-color-screen"
              type="checkbox"
              className="peer relative appearance-none w-5 h-5 bg-neutral-800 border border-neutral-600 rounded-md shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none max-[404px]:mt-[2px]"
            />

            <span className="text-sm font-medium">
              {showColorScreen && "See after"}
              {!showColorScreen && "See before"}
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
        )}
      </div>
    </>
  );
}

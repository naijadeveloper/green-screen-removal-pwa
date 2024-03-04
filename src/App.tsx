import { useState, useRef } from "react";

import Header from "./components/header";

import { FaVideo } from "react-icons/fa6";
import { FaFileVideo } from "react-icons/fa6";
import { FaCameraRetro, FaCheckCircle } from "react-icons/fa";
import { FcNoVideo } from "react-icons/fc";

import { useAppStore } from "./zustland/store";

import { cn } from "./lib/utils";

export default function App() {
  //input errors i.e the file selected isn't a video
  const [bgInputError, setBgInputError] = useState(false);
  const [gSInputError, setGSInputError] = useState(false);
  // references to the inputs used
  const bgInput = useRef<HTMLInputElement>(null);
  const gSInput = useRef<HTMLInputElement>(null);
  // states
  const isCamera = useAppStore((state) => state.isCamera);
  const bgVideo = useAppStore((state) => state.bgVideo);
  const greenSVideo = useAppStore((state) => state.greenSVideo);
  // actions
  const setIsCamera = useAppStore((state) => state.setIsCamera);
  const setBgVideo = useAppStore((state) => state.setBgVideo);
  const setGreenSVideo = useAppStore((state) => state.setGreenSVideo);

  function handleVideoSetting(
    vid: File | null,
    forWhichInput: "bg" | "greenS"
  ) {
    if (vid?.type.toLowerCase().includes("video")) {
      if (forWhichInput == "bg") {
        setBgVideo(vid);
      } else if (isCamera == false && forWhichInput == "greenS") {
        setGreenSVideo(vid);
      } else {
        return;
      }
    } else {
      if (forWhichInput == "bg") {
        setBgInputError(true);
        setTimeout(() => {
          setBgInputError(false);
        }, 5000);
      } else if (isCamera == false && forWhichInput == "greenS") {
        setGSInputError(true);
        setTimeout(() => {
          setGSInputError(false);
        }, 5000);
      }
    }

    //remove file
    if (forWhichInput == "bg") {
      bgInput.current!.value = "";
    } else {
      gSInput.current!.value = "";
    }
  }

  function handleButtonClick() {
    if (!bgVideo) {
      setBgInputError(true);
      setTimeout(() => {
        setBgInputError(false);
      }, 5000);
      return;
    }

    if (!greenSVideo && isCamera == false) {
      setGSInputError(true);
      setTimeout(() => {
        setGSInputError(false);
      }, 5000);
      return;
    }
  }
  return (
    <>
      <Header pathname="home" />
      <main className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto bg-neutral-700 rounded-lg text-neutral-200 overflow-auto flex flex-col gap-y-5 items-center justify-center">
        <div className="w-full max-w-sm px-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Background replacement video <sup>(required)</sup>
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                ref={bgInput}
                onChange={(e) => handleVideoSetting(e.target.files![0], "bg")}
                id="bg-video-file"
                type="file"
                className="hidden"
              />
              <div
                title={bgVideo?.name ?? "e.g beautiful-bg-scenery.mp4"}
                className="relative border border-e-0 text-neutral-400 text-sm w-full p-2.5 bg-neutral-900 border-neutral-600 flex flex-nowrap items-center gap-2 rounded-s-lg"
              >
                <span>
                  <FaVideo />
                </span>

                <span className="font-medium">
                  {bgVideo
                    ? bgVideo.name.length > 25
                      ? `${bgVideo.name.slice(0, 15)}...${bgVideo.name.slice(
                          -8
                        )}`
                      : `${bgVideo.name}`
                    : "e.g beautiful-bg-scenery.mp4"}
                </span>

                {bgVideo && (
                  <span className="text-[#9F8C76] text-lg animate-pulse absolute right-2">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>

            <label
              htmlFor="bg-video-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76]/70 hover:bg-[#9F8C76]/90 border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
          <p
            className={cn("mt-2 text-sm text-neutral-400 font-medium", {
              "text-red-300 font-semibold": bgInputError,
            })}
          >
            {bgInputError
              ? "Please select a video file"
              : "This video will be used as the new background"}
          </p>
        </div>

        {/* ....................................................................... */}
        <div className={cn("block w-full max-w-sm px-2", { hidden: isCamera })}>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Video with a green screen background <sup>(required)</sup>
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                ref={gSInput}
                onChange={(e) =>
                  handleVideoSetting(e.target.files![0], "greenS")
                }
                id="gsvideo-file"
                type="file"
                className="hidden"
              />
              <div
                title={greenSVideo?.name ?? "e.g green-screen-video.mp4"}
                className="border border-e-0 text-neutral-400 text-sm w-full p-2.5 bg-neutral-900 border-neutral-600 flex flex-nowrap items-center gap-2 rounded-s-lg"
              >
                <span className={cn("invisible", { visible: greenSVideo })}>
                  <FaVideo />
                </span>

                <span
                  className={cn("invisible font-medium", {
                    visible: greenSVideo,
                  })}
                >
                  {greenSVideo
                    ? greenSVideo.name.length > 25
                      ? `${greenSVideo.name.slice(
                          0,
                          15
                        )}...${greenSVideo.name.slice(-8)}`
                      : `${greenSVideo.name}`
                    : "e.g green-screen-video.mp4"}
                </span>

                {greenSVideo && (
                  <span className="text-[#9F8C76] text-lg animate-pulse absolute right-2">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>

            <label
              htmlFor="gsvideo-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76]/70 hover:bg-[#9F8C76]/90 border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
          <p
            className={cn("hidden mt-2 text-sm text-red-300 font-semibold", {
              block: gSInputError,
            })}
          >
            {gSInputError && "Please select a video file"}
          </p>
        </div>
        {/* ....................................................................... */}

        <button
          onClick={() => handleButtonClick()}
          className="w-[200px] h-[50px] relative -top-1 bg-[#9F8C76]/70 inline-flex items-center justify-center px-4 py-2 gap-2 rounded-lg border-b-4 border-neutral-900 hover:border-b-0 hover:bg-[#9F8C76]/90  hover:top-0"
        >
          <span className={cn("hidden", { "inline-block": isCamera })}>
            <FaCameraRetro />
          </span>
          <span
            className={cn("inline-block bg-neutral-700 px-1 rounded-md", {
              hidden: isCamera,
            })}
          >
            <FcNoVideo />
          </span>
          <span className="font-semibold">
            {isCamera ? "Open camera" : "View new video"}
          </span>
        </button>

        <label
          htmlFor="checkbox"
          className="absolute bottom-4 flex gap-x-2 mx-4 px-4 sm:items-center bg-neutral-800 py-1 pt-[6px] rounded-lg border-b-4 border-neutral-900 cursor-pointer"
        >
          <input
            onChange={() => {
              setIsCamera(!isCamera);
            }}
            checked={isCamera ? false : true}
            id="checkbox"
            type="checkbox"
            className="peer relative appearance-none w-6 h-6 max-sm:mt-1 bg-neutral-800 border border-neutral-600 rounded-md shrink-0 checked:bg-[#9F8C76]/80 checked:border-0 outline-none focus:outline-none"
          />

          <span className="text-base font-medium text-neutral-300">
            {isCamera
              ? "Check this, if instead, you would like to upload a video with a green screen, for removal"
              : "Uncheck this, if you want to use the camera for real-time 'green screen' removal"}
          </span>

          <svg
            className="absolute w-6 h-6 max-sm:mt-1 pointer-events-none hidden peer-checked:block"
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
      </main>
    </>
  );
}

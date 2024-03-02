import { useState } from "react";

import Header from "./components/header";

import { FaVideo } from "react-icons/fa6";
import { FaFileVideo } from "react-icons/fa6";
import { FaCameraRetro } from "react-icons/fa";
import { FcNoVideo } from "react-icons/fc";

import { useAppStore } from "./zustland/store";

export default function App() {
  //input errors i.e the file selected isn't a video
  const [bgInputError, setBgInputError] = useState(false);
  const [gSInputError, setGSInputError] = useState(false);
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
    // if video is null
    if (!vid) {
      return;
    }

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
  }
  return (
    <>
      <Header pathname="home" />
      <main className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto bg-zinc-800 rounded-lg text-zinc-200 overflow-auto flex flex-col gap-y-5 items-center justify-center">
        <div className="w-full max-w-sm px-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Background replacement video <sup>(required)</sup>
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                onChange={(e) => handleVideoSetting(e.target.files![0], "bg")}
                id="bg-video-file"
                type="file"
                className="hidden"
              />
              <div className="border border-e-0 text-zinc-400 text-sm w-full p-2.5 bg-zinc-900 border-zinc-600 flex flex-nowrap items-center gap-2 rounded-s-lg">
                <span>
                  <FaVideo />
                </span>

                <span title={bgVideo?.name ?? "e.g beautiful-bg-scenery.mp4"}>
                  {bgVideo
                    ? bgVideo.name.length > 25
                      ? `${bgVideo.name.slice(0, 15)}...${bgVideo.name.slice(
                          -8
                        )}`
                      : `${bgVideo.name}`
                    : "e.g beautiful-bg-scenery.mp4"}
                </span>
              </div>
            </div>

            <label
              htmlFor="bg-video-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76]/80 hover:bg-[#9F8C76] border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
          <p
            className={`mt-2 text-sm text-red-300 font-semibold ${
              !bgInputError && "text-zinc-400"
            }`}
          >
            {bgInputError
              ? "Please select a video file"
              : "This video will be used as the new background"}
          </p>
        </div>

        {/* ....................................................................... */}
        <div className={`block w-full max-w-sm px-2 ${isCamera && "hidden"}`}>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Video with a green screen background <sup>(required)</sup>
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                onChange={(e) =>
                  handleVideoSetting(e.target.files![0], "greenS")
                }
                id="gsvideo-file"
                type="file"
                className="hidden"
              />
              <div className="border border-e-0 text-zinc-400 text-sm w-full p-2.5 bg-zinc-900 border-zinc-600 flex flex-nowrap items-center gap-2 rounded-s-lg">
                <span className={`visible ${!greenSVideo && "invisible"}`}>
                  <FaVideo />
                </span>

                <span
                  className={`visible ${!greenSVideo && "invisible"}`}
                  title={greenSVideo?.name ?? "e.g green-screen-video.mp4"}
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
              </div>
            </div>

            <label
              htmlFor="gsvideo-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76]/80 hover:bg-[#9F8C76] border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
          <p
            className={`mt-2 text-sm block text-red-300 font-semibold ${
              !gSInputError && "hidden"
            }`}
          >
            {gSInputError && "Please select a video file"}
          </p>
        </div>
        {/* ....................................................................... */}

        <button className="w-[200px] h-[50px] relative -top-1 bg-[#9F8C76]/80 inline-flex items-center justify-center px-4 py-2 gap-2 rounded-lg border-b-4 border-zinc-900 hover:border-b-0 hover:bg-[#9F8C76]  hover:top-0">
          <span className={`${isCamera ? "inline-block" : "hidden"}`}>
            <FaCameraRetro />
          </span>
          <span
            className={`${
              isCamera ? "hidden" : "inline-block"
            } bg-zinc-700 px-1 rounded-md`}
          >
            <FcNoVideo />
          </span>
          <span className="font-semibold">
            {isCamera ? "Open camera" : "View new video"}
          </span>
        </button>

        <label
          htmlFor="checkbox"
          className="absolute bottom-4 flex gap-x-2 mx-4 px-4 sm:items-center bg-zinc-700 py-1 pt-[6px] rounded-lg border-b-4 border-zinc-900 cursor-pointer"
        >
          <input
            onChange={() => {
              setIsCamera(!isCamera);
            }}
            checked={isCamera ? false : true}
            id="checkbox"
            type="checkbox"
            className="peer relative appearance-none w-6 h-6 max-sm:mt-1 bg-zinc-800 border border-zinc-600 rounded-md shrink-0 checked:bg-[#9F8C76]/80 checked:border-0 outline-none focus:outline-none"
          />

          <span className="text-base font-medium text-zinc-300">
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

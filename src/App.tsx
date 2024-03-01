import { useState } from "react";

import Header from "./components/header";

import { FaVideo } from "react-icons/fa6";
import { FaFileVideo } from "react-icons/fa6";
import { FaCameraRetro } from "react-icons/fa";
import { FcNoVideo } from "react-icons/fc";

export default function App() {
  const [isCamera, setIsCamera] = useState(true);
  return (
    <>
      <Header pathname="home" />
      <main className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto bg-gray-700 rounded-lg text-gray-200 overflow-auto flex flex-col gap-y-5 items-center justify-center">
        <div className="w-full max-w-sm px-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Background replacement video <sup>(required)</sup>
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input id="bg-video-file" type="file" className="hidden" />
              <div className="border border-e-0 text-gray-400 text-sm w-full p-2.5 bg-gray-900 border-gray-600 flex flex-nowrap items-center gap-2 rounded-s-lg">
                <span>
                  <FaVideo />
                </span>

                <span title="e.g beautiful-bg-scenery.mp4">
                  e.g beautiful-bg-scenery.mp4
                </span>
              </div>
            </div>

            <label
              htmlFor="bg-video-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76] hover:bg-[#9F8C76]/80 border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
          <p
            id="helper-text-explanation"
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            This video will be used as the new background
          </p>
        </div>

        <div className={`block w-full max-w-sm px-2 ${isCamera && "hidden"}`}>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">
              Video with a green screen background
            </span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full">
              <input id="video-file" type="file" className="hidden" />
              <div className="border border-e-0 text-gray-400 text-sm w-full p-2.5 bg-gray-900 border-gray-600 flex flex-nowrap items-center gap-2 rounded-s-lg">
                <span className="invisible">
                  <FaVideo />
                </span>

                <span
                  className="invisible"
                  title="e.g beautiful-bg-scenery.mp4"
                >
                  e.g beautiful-bg-scenery.mp4
                </span>
              </div>
            </div>

            <label
              htmlFor="video-file"
              className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center rounded-e-lg bg-[#9F8C76] hover:bg-[#9F8C76]/80 border border-[#9F8C76]/70 cursor-pointer"
            >
              <span className="w-4 h-4 text-xl flex items-center justify-center">
                <FaFileVideo />
              </span>
            </label>
          </div>
        </div>

        <button className="w-[200px] h-[50px] relative -top-1 bg-[#9F8C76] inline-flex items-center justify-center px-4 py-2 gap-2 rounded-lg border-b-4 border-gray-800 hover:border-b-0 hover:bg-[#9F8C76]/80  hover:top-0">
          <span className={`${isCamera ? "inline-block" : "hidden"}`}>
            <FaCameraRetro />
          </span>
          <span
            className={`${
              isCamera ? "hidden" : "inline-block"
            } bg-gray-700 px-1 rounded-md`}
          >
            <FcNoVideo />
          </span>
          <span className="font-semibold">
            {isCamera ? "Open camera" : "View new video"}
          </span>
        </button>

        <div className="absolute bottom-4 flex gap-x-2 px-4 sm:items-center">
          <input
            onChange={() => {
              setIsCamera((prev) => !prev);
            }}
            checked={isCamera ? false : true}
            id="checkbox"
            type="checkbox"
            className="peer relative appearance-none w-6 h-6 max-sm:mt-1 bg-gray-800 border border-gray-600 rounded-md shrink-0 checked:bg-[#9F8C76] checked:border-0 outline-none focus:outline-none"
          />

          <label
            htmlFor="checkbox"
            className="text-base font-medium text-gray-300"
          >
            {isCamera
              ? "Check this, if instead, you would like to upload a video with a green screen, for removal"
              : "Uncheck this, if you want to use the camera for real-time 'green screen' removal"}
          </label>

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
        </div>
      </main>
    </>
  );
}

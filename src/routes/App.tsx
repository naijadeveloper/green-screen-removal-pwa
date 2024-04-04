import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import HomeRouteDialog from "../components/home_route_dialog";
import { FaVideo, FaFileVideo, FaFileImage, FaImage } from "react-icons/fa6";
import { FaCameraRetro, FaCheckCircle, FaVideoSlash } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import { RiFolderUploadFill } from "react-icons/ri";
import { useAppStore } from "../zustland/store";
import { cn } from "../lib/utils";

export default function App() {
  // navigation
  const navigate = useNavigate();
  //input errors i.e the file selected isn't a video
  const [bgInputError, setBgInputError] = useState(false);
  const [screenInputError, setScreenInputError] = useState(false);
  // references to the inputs used
  const bgInput = useRef<HTMLInputElement>(null);
  const screenInput = useRef<HTMLInputElement>(null);
  // states
  const isCamera = useAppStore((state) => state.isCamera);
  const bgFile = useAppStore((state) => state.bgFile);
  const screenFile = useAppStore((state) => state.screenFile);
  const screenColor = useAppStore((state) => state.screenColor);
  const bgFileType = useAppStore((state) => state.bgFileType);
  const screenFileType = useAppStore((state) => state.screenFileType);
  const allowMultiple = useAppStore((state) => state.allowMultipleBgFiles);
  // actions
  const setIsCamera = useAppStore((state) => state.setIsCamera);
  const setBgFile = useAppStore((state) => state.setBgFile);
  const setScreenFile = useAppStore((state) => state.setScreenFile);

  function handleVideoSetting(
    vidOrImg: File | FileList | null,
    forWhichInput: "bg" | "sf"
  ) {
    if (forWhichInput == "bg") {
      if (!allowMultiple) {
        let file = (vidOrImg! as FileList)[0];
        let fileType = file.type.toLowerCase();
        if (!fileType.includes(bgFileType.toLowerCase())) {
          setBgInputError(true);
          setTimeout(() => {
            setBgInputError(false);
          }, 5000);
          bgInput.current!.value = "";
        } else {
          // if the fileType and bgFileType match
          setBgFile(vidOrImg as FileList | null);
        }
      } else {
        // if allow multiple is true
        if (bgFileType == "video" || bgFileType == "image") {
          let perfect: boolean | undefined = Array.from(vidOrImg! as FileList)
            .map((file) =>
              file.type.toLowerCase().includes(bgFileType.toLowerCase())
            )
            .find((val) => !val);
          // it will be undefined after 'find' runs and finds no match
          // else it will be the value of the match it finds
          if (perfect == undefined) {
            perfect = true;
          }
          // if not perfect
          if (!perfect) {
            setBgInputError(true);
            setTimeout(() => {
              setBgInputError(false);
            }, 5000);
            bgInput.current!.value = "";
          } else {
            // we didn't find an imposter, we are save
            setBgFile(vidOrImg as FileList);
          }
        } else {
          // if we are allowing both images and videos
          let perfect: boolean | undefined = Array.from(vidOrImg! as FileList)
            .map(
              (file) =>
                file.type.toLowerCase().includes("video") ||
                file.type.toLowerCase().includes("image")
            )
            .find((val) => !val);
          // it will be undefined after find runs and finds no match
          // else it will be the value of the match it finds
          if (perfect == undefined) {
            perfect = true;
          }
          // if not perfect
          if (!perfect) {
            setBgInputError(true);
            setTimeout(() => {
              setBgInputError(false);
            }, 5000);
            bgInput.current!.value = "";
          } else {
            // we didn't find an imposter, we are save
            setBgFile(vidOrImg as FileList);
          }
        }
      }
    } else {
      // if sf i.e if its the screen input
      let fileType = (vidOrImg as File).type.toLowerCase();
      if (fileType.includes(screenFileType.toLowerCase())) {
        setScreenFile(vidOrImg as File | null);
      } else {
        setScreenInputError(true);
        setTimeout(() => {
          setScreenInputError(false);
        }, 5000);
        screenInput.current!.value = "";
      }
    }
  }

  function handleButtonClick() {
    if (!bgFile || bgFile.length == 0) {
      setBgInputError(true);
      setTimeout(() => {
        setBgInputError(false);
      }, 5000);
      return;
    }

    if (!screenFile && isCamera == false) {
      setScreenInputError(true);
      setTimeout(() => {
        setScreenInputError(false);
      }, 5000);
      return;
    }

    // if bgvideo and camera is true
    // open "/camera"
    if (bgFile && isCamera == true) {
      navigate("/camera");
    }

    // if isCamera is false and both bgFile and screenFile are true
    // open "/view-new-vid"
    if (!isCamera && bgFile && screenFile) {
      navigate("/view-new-vid");
    }
  }
  return (
    <>
      <Header pathname="home" />
      <main className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto bg-neutral-700 rounded-lg text-neutral-200 overflow-auto flex flex-col gap-y-5 items-center justify-center select-none">
        {/* settings menu */}
        <HomeRouteDialog />
        {/* .... */}
        <div className="w-full max-w-md px-2 flex flex-col gap-y-2 items-start">
          {/* input top description */}
          <p className="text-sm font-medium">
            Background replacement{" "}
            {bgFileType == "video" && allowMultiple && "videos"}
            {bgFileType == "image" && allowMultiple && "images"}
            {bgFileType == "video" && !allowMultiple && "video"}
            {bgFileType == "image" && !allowMultiple && "image"}
            {bgFileType == "both" && "files"}{" "}
            <span className="text-[11px] leading-3">(required)</span>
          </p>

          {/* input and label */}
          <div className="w-full h-[50px]">
            <input
              ref={bgInput}
              onChange={(e) => handleVideoSetting(e.target.files!, "bg")}
              id="bg-video-file"
              type="file"
              className="hidden"
              accept={`${bgFileType == "video" ? "video/*" : ""}${
                bgFileType == "image" ? "image/png, image/jpeg" : ""
              }${bgFileType == "both" ? "video/*, image/png, image/jpeg" : ""}`}
              multiple={allowMultiple}
            />

            <label
              htmlFor="bg-video-file"
              className="w-full h-full flex cursor-pointer"
            >
              <div
                title={
                  Array.from(bgFile ?? []).length == 0
                    ? `e.g beautiful-bg-scenery.${
                        bgFileType == "video" ? "mp4" : ""
                      }${bgFileType == "image" ? "jpg" : ""}${
                        bgFileType == "both" ? "mp4/jpg" : ""
                      }`
                    : `${Array.from(bgFile!)
                        .map((file) => file.name)
                        .join(", ")}`
                }
                className="relative w-[85%] h-full bg-neutral-900 rounded-s-lg flex items-center gap-x-3 px-2"
              >
                <span>
                  {bgFileType == "video" && <FaVideo />}
                  {bgFileType == "image" && <FaImage />}
                </span>
                <p className="grow-[1] max-w-[80%] font-medium text-nowrap overflow-hidden text-ellipsis">
                  {bgFile && bgFile.length > 0
                    ? Array.from(bgFile!)
                        .map((file) =>
                          file.name.length > 25
                            ? `${file.name.slice(0, 15)}...${file.name.slice(
                                -8
                              )}`
                            : file.name
                        )
                        .join(", ")
                    : `e.g beautiful-bg-scenery.${
                        bgFileType == "video" ? "mp4" : ""
                      }${bgFileType == "image" ? "jpg" : ""}${
                        bgFileType == "both" ? "mp4/jpg" : ""
                      }`}
                </p>
                {bgFile && bgFile.length > 0 && (
                  <span className="text-primary text-lg animate-pulse absolute right-2">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
              <div className="w-[15%] h-full bg-primary flex items-center justify-center rounded-e-lg hover:bg-primary/90">
                <span className="text-primary-foreground text-2xl">
                  {bgFileType == "video" && <FaFileVideo />}
                  {bgFileType == "image" && <FaFileImage />}
                  {bgFileType == "both" && <RiFolderUploadFill />}
                </span>
              </div>
            </label>
          </div>

          {/* error mmsg */}
          <p
            className={cn("hidden text-sm text-red-300 font-semibold", {
              block: bgInputError,
            })}
          >
            {bgInputError &&
              `Please select ${
                allowMultiple && bgFileType == "video" ? "video files" : ""
              }${allowMultiple && bgFileType == "image" ? "image files" : ""}${
                !allowMultiple && bgFileType == "video" ? "a video file" : ""
              }${
                !allowMultiple && bgFileType == "image" ? "an image file" : ""
              }${bgFileType == "both" ? "videos or images or both" : ""}`}
          </p>
        </div>

        {/*.........................................................................*/}

        <div
          className={cn(
            "w-full max-w-md px-2 flex flex-col gap-y-2 items-start",
            { hidden: isCamera }
          )}
        >
          {/* input top description */}
          <p className="text-sm font-medium">
            {screenColor
              .split("")
              .map((c, i) => (i == 0 ? c.toUpperCase() : c))
              .join("")}{" "}
            screen background {screenFileType}{" "}
            <span className="text-[11px] leading-3">(required)</span>
          </p>

          {/* input and label */}
          <div className="w-full h-[50px]">
            <input
              ref={screenInput}
              onChange={(e) => handleVideoSetting(e.target.files![0], "sf")}
              id="screen-file"
              type="file"
              accept={`${screenFileType == "video" ? "video/*" : ""}${
                screenFileType == "image" ? "image/png, image/jpeg" : ""
              }`}
              className="hidden"
            />

            <label
              htmlFor="screen-file"
              className="w-full h-full flex cursor-pointer"
            >
              <div
                title={
                  screenFile?.name ??
                  `e.g ${screenColor}-screen-${
                    screenFileType == "video" ? "video.mp4" : "image.jpg"
                  }`
                }
                className="relative w-[85%] h-full bg-neutral-900 rounded-s-lg flex items-center gap-x-3 px-2"
              >
                <span className={cn("invisible", { visible: screenFile })}>
                  {screenFileType == "video" && <FaVideo />}
                  {screenFileType == "image" && <FaImage />}
                </span>
                <p
                  className={cn(
                    "invisible grow-[1] max-w-[80%] font-medium text-nowrap overflow-hidden text-ellipsis",
                    {
                      visible: screenFile,
                    }
                  )}
                >
                  {screenFile
                    ? screenFile.name.length > 25
                      ? `${screenFile.name.slice(
                          0,
                          15
                        )}...${screenFile.name.slice(-8)}`
                      : `${screenFile.name}`
                    : ""}
                </p>
                {screenFile && (
                  <span className="text-primary text-lg animate-pulse absolute right-2">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
              <div className="w-[15%] h-full bg-primary flex items-center justify-center rounded-e-lg hover:bg-primary/90">
                <span className="text-primary-foreground text-2xl">
                  {screenFileType == "video" && <FaFileVideo />}
                  {screenFileType == "image" && <FaFileImage />}
                </span>
              </div>
            </label>
          </div>

          {/* error mmsg */}
          <p
            className={cn("hidden text-sm text-red-300 font-semibold", {
              block: screenInputError,
            })}
          >
            {screenInputError &&
              `Please select ${
                screenFileType == "video" ? "a video file" : ""
              }${screenFileType == "image" ? "an image file" : ""}`}
          </p>
        </div>

        {/* ....................................................................... */}

        <button
          onClick={() => handleButtonClick()}
          className="w-[200px] h-[50px] relative -top-1 bg-primary inline-flex items-center justify-center px-4 py-2 gap-2 rounded-lg border-b-4 border-neutral-900 hover:border-b-0 hover:bg-primary/90  hover:top-0 text-primary-foreground"
        >
          <span className={cn("hidden", { "inline-block": isCamera })}>
            <FaCameraRetro />
          </span>
          <span
            className={cn("inline-block bg-neutral-900 px-1 rounded", {
              hidden: isCamera,
              "text-red-700": screenColor == "red",
              "text-green-700": screenColor == "green",
              "text-blue-700": screenColor == "blue",
            })}
          >
            {screenFileType == "image" && <MdImageNotSupported />}
            {screenFileType == "video" && <FaVideoSlash />}
          </span>
          <span className="font-semibold">
            {isCamera ? "Open camera" : `View new ${screenFileType}`}
          </span>
        </button>

        <label
          htmlFor="checkbox"
          className="absolute bottom-1 flex gap-x-2 mx-4 px-4 sm:items-center bg-neutral-800 py-1 pt-[6px] rounded-lg border-b-4 border-neutral-900 cursor-pointer"
        >
          <input
            onChange={() => {
              setIsCamera();
            }}
            checked={isCamera ? false : true}
            id="checkbox"
            type="checkbox"
            className="peer relative appearance-none w-6 h-6 max-sm:mt-1 bg-neutral-800 border border-neutral-600 rounded-md shrink-0 checked:bg-primary checked:border-0 outline-none focus:outline-none"
          />

          <span className="text-base font-medium text-neutral-300">
            {isCamera
              ? `Check this, if instead, you would like to upload ${
                  screenFileType == "video" ? "a video" : "an image"
                } with a '${screenColor} screen', for removal`
              : `Uncheck this, if you want to use the camera for real-time '${screenColor} screen' removal`}
          </span>

          <svg
            className="absolute w-6 h-6 max-sm:mt-1 pointer-events-none hidden peer-checked:block text-primary-foreground"
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

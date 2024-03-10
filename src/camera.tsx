import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { useAppStore } from "./zustland/store";

export default function Camera() {
  // navigation
  const navigate = useNavigate();

  // local state
  const [cameraFace, setCameraFace] = useState<"environment" | "user">(
    "environment"
  );

  // global states
  const isCamera = useAppStore((state) => state.isCamera);
  const bgVideo = useAppStore((state) => state.bgVideo);

  const bgVideoElem = useRef<HTMLVideoElement>(null);
  const placeholderVideo = useRef<HTMLVideoElement>(null);
  const mainElem = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isCamera || !bgVideo) {
      navigate("/");
      return;
    }

    // generate url for bgVideo
    let bgVideoUrl = URL.createObjectURL(bgVideo!);

    // set video src to url
    bgVideoElem.current?.setAttribute("src", bgVideoUrl);

    // background canvas
    const bgCanvas = document.createElement("canvas");
    bgCanvas.classList.add("absolute", "invisible");
    mainElem.current?.prepend(bgCanvas);

    // height and width, defaults of 300 for both
    // they would be changed later
    let width: number = 300,
      height: number = 300;

    // canvas context
    let ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    let bgCtx = bgCanvas.getContext("2d", { willReadFrequently: true });

    // define play functions of both videos
    bgVideoElem.current?.addEventListener("play", bgFrame);
    placeholderVideo.current?.addEventListener("play", () => {
      // redefine width and height
      width = placeholderVideo.current!.offsetWidth;
      height = placeholderVideo.current!.offsetHeight;

      bgCanvas.setAttribute("width", String(width));
      bgCanvas.setAttribute("height", String(height));

      canvas.current!.setAttribute("width", String(width));
      canvas.current!.setAttribute("height", String(height));

      console.log(
        `offset width of vid ${width} and offset height of vid ${height}. Now width of canvas ${canvas.current?.getAttribute(
          "width"
        )} and height of canvas ${canvas.current?.getAttribute("height")}.`
      );
      frame();
    });

    // constraints of camera
    const constraints = {
      audio: true,
      video: {
        facingMode: cameraFace,
      },
    };

    // get feed from camera
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // load stream of data to video element
        placeholderVideo.current!.srcObject = stream;
        // play both videos
        placeholderVideo.current!.onloadedmetadata = () => {
          placeholderVideo.current!.play();
          bgVideoElem.current!.play();
        };
      })
      .catch((err) => {
        console.log(err);
      });

    // frame function to draw on canvas
    function frame() {
      height =
        (canvas.current?.width! / placeholderVideo.current?.videoWidth!) *
        placeholderVideo.current?.videoHeight!;

      canvas.current!.setAttribute("height", String(height));

      ctx?.drawImage(placeholderVideo.current!, 0, 0, width, height);
      // remove green screen and add bgVideo data
      let vidData = ctx?.getImageData(0, 0, width, height);
      let vidData2 = bgCtx?.getImageData(0, 0, width, height);

      for (let i = 0; i < vidData?.data.length!; i += 4) {
        let r = vidData?.data[i]!; // red
        let g = vidData?.data[i + 1]!; // green
        let b = vidData?.data[i + 2]!; // blue

        if (g >= r + 50 && g >= b + 50) {
          // vidData!.data[i + 3] = 0;
          vidData!.data[i] = vidData2!.data[i]; // r
          vidData!.data[i + 1] = vidData2!.data[i + 1]; // g
          vidData!.data[i + 2] = vidData2!.data[i + 2]; // b
        }
      }

      ctx?.putImageData(vidData!, 0, 0);

      requestAnimationFrame(frame);
    }

    function bgFrame() {
      bgCanvas.setAttribute("height", String(height));

      bgCtx?.drawImage(bgVideoElem.current!, 0, 0, width, height);
      requestAnimationFrame(bgFrame);
    }

    return () => {
      bgVideoElem.current?.removeEventListener("play", () => {});
      placeholderVideo.current?.removeEventListener("play", () => {});
    };
  }, [cameraFace]);

  return (
    <main
      ref={mainElem}
      className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto rounded-lg overflow-hidden flex flex-col items-center justify-center"
    >
      <video
        ref={bgVideoElem}
        src=""
        loop
        muted
        className="invisible absolute rounded-lg"
      />

      <video
        ref={placeholderVideo}
        src=""
        className="invisible absolute w-full h-full rounded-lg"
      />

      <canvas ref={canvas} className="absolute rounded-lg"></canvas>
    </main>
  );
}

import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { useAppStore } from "./zustland/store";

import { convertBlobToUrl } from "./lib/view_new_vid_functions";

export default function ViewNewVideo() {
  // navigation
  const navigate = useNavigate();

  // states
  const isCamera = useAppStore((state) => state.isCamera);
  const bgVideo = useAppStore((state) => state.bgVideo);
  const greenSVideo = useAppStore((state) => state.greenSVideo);

  const bgVideoElem = useRef<HTMLVideoElement>(null);
  const mainElem = useRef<HTMLElement>(null);
  const gSVideoElem = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCamera || !bgVideo || !greenSVideo) {
      navigate("/");
      return;
    }

    // run function to generate a URL from the videos
    let [bgVideoUrl, gSVideoUrl] = convertBlobToUrl(bgVideo, greenSVideo);

    // set video src to url
    bgVideoElem.current?.setAttribute("src", bgVideoUrl);
    gSVideoElem.current?.setAttribute("src", gSVideoUrl);

    // width and height for both bgVido and gSVideo
    let width = gSVideoElem.current!.offsetWidth;
    let height = gSVideoElem.current!.offsetHeight;
    console.log(width, height);

    // new canvas
    const bgCanvas = document.createElement("canvas");
    bgCanvas.classList.add("absolute", "invisible");
    mainElem.current?.prepend(bgCanvas);

    // set width for bgCanvas
    bgCanvas.setAttribute("width", String(width));
    bgCanvas.setAttribute("height", String(height));

    // draw on canvas
    let bgCtx = bgCanvas.getContext("2d", { willReadFrequently: true });
    bgVideoElem.current?.addEventListener("play", bgFrame);

    ///////////////////////////////////////////////////////////////////////

    // part2

    // setAttribute for width and height of canvas
    canvas.current!.setAttribute("width", String(width));
    canvas.current!.setAttribute("height", String(height));

    // canvas context
    let ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    gSVideoElem.current?.addEventListener("play", frame);

    // frame function to draw on canvas
    function frame() {
      height =
        (canvas.current?.width! / gSVideoElem.current?.videoWidth!) *
        gSVideoElem.current?.videoHeight!;

      canvas.current!.setAttribute("height", String(height));

      ctx?.drawImage(gSVideoElem.current!, 0, 0, width, height);
      // remove green screen and add bgVideo data
      let vidData = ctx?.getImageData(0, 0, width, height);
      let vidData2 = bgCtx?.getImageData(0, 0, width, height);

      for (let i = 0; i < vidData?.data.length!; i += 4) {
        let r = vidData?.data[i]!; // red
        let g = vidData?.data[i + 1]!; // green
        let b = vidData?.data[i + 2]!; // blue

        if (r < 80 && g >= 100 && g <= 190 && b < 80) {
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

    // resets
    return () => {
      bgVideoElem.current?.removeEventListener("play", () => {});
      gSVideoElem.current?.removeEventListener("play", () => {});

      bgVideoElem.current!.srcObject = null;
      gSVideoElem.current!.srcObject = null;
    };
  }, []);

  return (
    <main
      ref={mainElem}
      className="relative h-0 grow-[1] w-[98%] sm:w-[95%] mx-auto rounded-lg overflow-hidden flex flex-col items-center justify-center"
    >
      <video
        ref={bgVideoElem}
        src=""
        autoPlay
        loop
        muted
        className="invisible absolute rounded-lg"
      />

      <video
        ref={gSVideoElem}
        src=""
        autoPlay
        loop
        className="invisible absolute w-full h-full rounded-lg"
      />

      <canvas ref={canvas} className="absolute rounded-lg"></canvas>
    </main>
  );
}

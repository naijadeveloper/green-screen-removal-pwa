export function screenRemoval(
  bgFObj: { url: string; fileType: string },
  sVElem: React.RefObject<HTMLVideoElement>,
  bgFElem: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  bgCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  showColorScreen: boolean,
  cameraPos: string,
  screenColor: string,
  setAnimes: React.Dispatch<React.SetStateAction<number[]>>,
  setCameraStream: React.Dispatch<React.SetStateAction<MediaStream | null>>
) {
  // get actual elements from RefObject
  let sE = sVElem.current!;
  let bgE = bgFElem.current!;

  // set the url of the bg element
  bgE.setAttribute("src", bgFObj.url);

  // get 2d context from bg canvas and screen canvas
  let bgCtx = bgCanvas.getContext("2d", { willReadFrequently: true });
  let ctx = canvas.getContext("2d", { willReadFrequently: true });

  // set width and height as undefined here
  let width: number;
  let height: number;

  // set play event for background element and stream video element
  // if bg Element is a video, it's play event will fire
  bgE.addEventListener("play", () => {
    let checkDimen = setInterval(() => {
      if (width && height) {
        clearInterval(checkDimen);
        bgDraw();
      }
    }, 500);
  });

  sE.addEventListener("play", () => {
    // define the width and height here
    width = sE.offsetWidth;
    height = sE.offsetHeight;

    // set height and width for both canvas and background canvas
    canvas.setAttribute("width", String(width));
    canvas.setAttribute("height", String(height));
    bgCanvas.setAttribute("width", String(width));
    bgCanvas.setAttribute("height", String(height));

    /// clear canvases - clean up
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    bgCtx!.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // call fn to draw on canvas
    streamVideoDraw();
  });

  // the load event fires instead if an image
  bgE.addEventListener("load", () => {
    let checkDimen = setInterval(() => {
      if (width && height) {
        clearInterval(checkDimen);
        bgDraw();
      }
    }, 500);
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // OPEN THE CAMERA ///////////////////////////////////////////

  // define camera constraints
  const constraints = {
    audio: true,
    video: {
      facingMode: cameraPos == "front" ? "user" : "environment",
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      setCameraStream(() => mediaStream);

      sE.srcObject = mediaStream;
      sE.onloadedmetadata = () => {
        sE.play();
      };
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`${err.name}: ${err.message}`);
    });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  function bgDraw() {
    bgCtx?.drawImage(bgE, 0, 0, width, height);

    let anime = requestAnimationFrame(bgDraw);

    // save anime
    setTimeout(() => {
      setAnimes((prev) => {
        prev[0] = anime;
        return prev;
      });
    }, 1000);
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  function streamVideoDraw() {
    height =
      (canvas.width! / (sE as HTMLVideoElement).videoWidth) *
      (sE as HTMLVideoElement).videoHeight;

    // recalculate height
    canvas.setAttribute("height", String(height));
    bgCanvas.setAttribute("height", String(height));

    // draw and loop
    drawingData();
    let anime = requestAnimationFrame(streamVideoDraw);

    // save anime
    setTimeout(() => {
      setAnimes((prev) => {
        prev[1] = anime;
        return prev;
      });
    }, 1000);
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  function drawingData() {
    ctx?.drawImage(sE, 0, 0, width, height);

    if (showColorScreen) {
      return;
    }

    // get image data
    let vidData = ctx?.getImageData(
      0,
      0,
      width,
      Boolean(height) ? height : sE.offsetHeight
    );
    let bgVidData = bgCtx?.getImageData(
      0,
      0,
      width,
      Boolean(height) ? height : sE.offsetHeight
    );

    for (let i = 0; i < vidData?.data.length!; i += 4) {
      let r = vidData?.data[i]!; // red
      let g = vidData?.data[i + 1]!; // green
      let b = vidData?.data[i + 2]!; // blue

      switch (screenColor) {
        case "red": {
          if (r >= g + 30 && r >= b + 30) {
            vidData!.data[i] = bgVidData!.data[i];
            vidData!.data[i + 1] = bgVidData!.data[i + 1];
            vidData!.data[i + 2] = bgVidData!.data[i + 2];
          }
          break;
        }

        case "green": {
          if (g >= r + 30 && g >= b + 30) {
            vidData!.data[i] = bgVidData!.data[i];
            vidData!.data[i + 1] = bgVidData!.data[i + 1];
            vidData!.data[i + 2] = bgVidData!.data[i + 2];
          }
          break;
        }

        default: {
          if (b >= g + 30 && b >= r + 30) {
            vidData!.data[i] = bgVidData!.data[i];
            vidData!.data[i + 1] = bgVidData!.data[i + 1];
            vidData!.data[i + 2] = bgVidData!.data[i + 2];
          }
        }
      }
    }

    ctx?.putImageData(vidData!, 0, 0);
  }

  // return for clean ups
  return { ctx, bgCtx };
}

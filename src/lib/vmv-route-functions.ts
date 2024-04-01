export function screenRemoval(
  sFObj: { url: string; fileType: string },
  bgFObj: { url: string; fileType: string },
  sFElem: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  bgFElem: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  bgCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  tolerance: number,
  screenColor: string
) {
  // animation frame id
  let anime1;
  let anime2;

  // get actual elements from RefObject
  let sE = sFElem.current!;
  let bgE = bgFElem.current!;

  // set the url of the screen file element and bg element
  sE.setAttribute("src", sFObj.url);
  bgE.setAttribute("src", bgFObj.url);

  // get 2d context from bg canvas and screen canvas
  let bgCtx = bgCanvas.getContext("2d", { willReadFrequently: true });
  let ctx = canvas.getContext("2d", { willReadFrequently: true });

  // get initial width and height from screen file element
  let width: number = sE.offsetWidth;
  let height: number = sE.offsetHeight;

  // set height and width for both canvas and background canvas
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));
  bgCanvas.setAttribute("width", String(width));
  bgCanvas.setAttribute("height", String(height));

  /// clear canvases - clean up
  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  bgCtx!.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // set play event for background element and screen element
  // if any is a video the function will fire when the play
  // event if triggered
  bgE.addEventListener("play", bgDraw);
  sE.addEventListener("play", screenDraw);

  // runs only for images i.e if the background / screen element is an image
  // this will run
  bgE.addEventListener("load", bgDraw);
  sE.addEventListener("load", screenDraw);

  // if (sFObj.fileType == "image") {
  //   screenDraw();
  // }

  // if (bgFObj.fileType == "image") {
  //   bgDraw();
  // }

  /////////////
  function bgDraw() {
    // set height of background canvas
    bgCanvas.setAttribute("height", String(height));

    bgCtx?.drawImage(bgE, 0, 0, width, height);
    anime1 = requestAnimationFrame(bgDraw);
  }

  /////////////
  function screenDraw() {
    if (sFObj.fileType == "video") {
      height =
        (canvas.width! / (sE as HTMLVideoElement).videoWidth) *
        (sE as HTMLVideoElement).videoHeight;
    } else {
      height = Math.floor(canvas.width * (9 / 16));
    }

    // recalculate height
    canvas.setAttribute("height", String(height));

    // draw and loop
    drawingData();
    anime2 = requestAnimationFrame(screenDraw);
  }

  /////////////
  function drawingData() {
    ctx?.drawImage(sE, 0, 0, width, height);

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

      // g >= r + 50 && g >= b + 50
      // vidData!.data[i + 3] = 0;

      switch (screenColor) {
        case "red": {
          if (r > g && r > b) {
            if (tolerance == 0) {
              if (r >= g + 30 && r >= b + 30) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            } else {
              if (r >= g + b + tolerance) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            }
          }
          break;
        }

        case "green": {
          if (g > r && g > b) {
            if (tolerance == 0) {
              if (g >= r + 30 && g >= b + 30) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            } else {
              if (g >= r + b + tolerance) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            }
          }
          break;
        }

        default: {
          if (b > g && b > r) {
            if (tolerance == 0) {
              if (b >= g + 30 && b >= r + 30) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            } else {
              if (b >= g + r + tolerance) {
                vidData!.data[i] = bgVidData!.data[i];
                vidData!.data[i + 1] = bgVidData!.data[i + 1];
                vidData!.data[i + 2] = bgVidData!.data[i + 2];
              }
            }
          }
        }
      }
    }

    ctx?.putImageData(vidData!, 0, 0);
  }

  // return for clean ups
  return { ctx, bgCtx, anime1, anime2 };
}

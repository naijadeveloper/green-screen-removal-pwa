export function screenRemoval(
  sFObj: { url: string; fileType: string },
  bgFObj: { url: string; fileType: string },
  sFElem: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  bgFElem: React.RefObject<HTMLVideoElement | HTMLImageElement>,
  bgC: React.RefObject<HTMLCanvasElement>,
  c: React.RefObject<HTMLCanvasElement>,
  tolerance: number,
  screenColor: string
) {
  // animation frame id
  let anime1;
  let anime2;

  // get actual elements from RefObject
  let sE = sFElem.current!;
  let bgE = bgFElem.current!;
  let bgCanvas = bgC.current!;
  let canvas = c.current!;

  // remove the src attribute - clean up
  sE.removeAttribute("src");
  bgE.removeAttribute("src");

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
  sE.addEventListener("play", drawingVideo);

  // this runs if its an image
  if (bgFObj.fileType == "image") {
    bgDraw();
  }

  // same for this
  if (sFObj.fileType == "image") {
    drawingImage();
  }

  /////////////
  function bgDraw() {
    // set height of background canvas
    bgCanvas.setAttribute("height", String(height));

    bgCtx?.drawImage(bgE, 0, 0, width, height);
    anime1 = requestAnimationFrame(bgDraw);
  }

  /////////////
  function drawingVideo() {
    height =
      (canvas.width! / (sE as HTMLVideoElement).videoWidth) *
      (sE as HTMLVideoElement).videoHeight;

    // recalculate height
    canvas.setAttribute("height", String(height));

    // draw and loop
    drawingData();
    anime2 = requestAnimationFrame(drawingVideo);
  }

  /////////////
  function drawingImage() {
    height = Math.floor(canvas.width * (9 / 16));

    // recalculate height
    canvas.setAttribute("height", String(height));

    // draw and loop
    drawingData();
    anime2 = requestAnimationFrame(drawingImage);
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
            if (r >= g + b + tolerance) {
              vidData!.data[i] = bgVidData!.data[i];
              vidData!.data[i + 1] = bgVidData!.data[i + 1];
              vidData!.data[i + 2] = bgVidData!.data[i + 2];
            }
          }
          break;
        }

        case "green": {
          if (g > r && g > b) {
            if (g >= r + b + tolerance) {
              vidData!.data[i] = bgVidData!.data[i];
              vidData!.data[i + 1] = bgVidData!.data[i + 1];
              vidData!.data[i + 2] = bgVidData!.data[i + 2];
            }
          }
          break;
        }

        default: {
          if (b > r && b > g) {
            if (b >= r + g + tolerance) {
              vidData!.data[i] = bgVidData!.data[i];
              vidData!.data[i + 1] = bgVidData!.data[i + 1];
              vidData!.data[i + 2] = bgVidData!.data[i + 2];
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

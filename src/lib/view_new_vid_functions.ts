export function convertBlobToUrl(
  bgVideo: File | null,
  greenSVideo: File | null
) {
  let bgVideoUrl = URL.createObjectURL(bgVideo!);
  let greenSVideoUrl = URL.createObjectURL(greenSVideo!);

  return [bgVideoUrl, greenSVideoUrl];
}

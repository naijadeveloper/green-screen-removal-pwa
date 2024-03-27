export function getUrl(...files: File[]) {
  let screenFileUrl = URL.createObjectURL(files[0]);
  let bgFilesUrls = files.slice(1).map((file) => URL.createObjectURL(file));

  return [screenFileUrl, ...bgFilesUrls];
}

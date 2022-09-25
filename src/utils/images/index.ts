export const blobUrlToFile = (blobUrl: string): Promise<File> =>
  new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        // please change the file.extension with something more meaningful
        // or create a utility function to parse from URL
        const file = new File([blob], "file.extension", { type: blob.type });
        resolve(file);
      });
    });
  });

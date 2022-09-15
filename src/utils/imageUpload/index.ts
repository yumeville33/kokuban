import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadString,
} from "firebase/storage";

import { storage } from "../firebase";
import keyGen from "../keyGen";

const imageUpload = async (file: File | string) => {
  let fileType = "";

  if (typeof file === "string") {
    /* eslint-disable prefer-destructuring */
    fileType = file.split(";")[0].split(":")[1].split("/")[1];
    /* eslint-enable prefer-destructuring */
  }

  const imageRef = `images/${keyGen()}${
    typeof file === "string" ? `.${fileType}` : `-${file.name.toLowerCase()}`
  }`;
  const storageRef = ref(storage, imageRef);
  // const img = await uploadBytes(storageRef, file);

  if (typeof file === "string") {
    const img = await uploadString(storageRef, file, "data_url");
    const imageUrl = await getDownloadURL(img.ref);
    const image = {
      url: imageUrl,
      ref: imageRef,
    };

    return image;
  }
  const img = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(ref(storage, img?.ref.fullPath));
  const image = {
    url: imageUrl,
    ref: imageRef,
  };

  return image;

  // const imgUrl = await getDownloadURL(ref(storage, img?.ref.fullPath));

  // const image = {
  //   url: imgUrl,
  //   ref: imageRef,
  // };

  // if (img?.ref.fullPath) {
  //   return image;
  // }
};

export default imageUpload;

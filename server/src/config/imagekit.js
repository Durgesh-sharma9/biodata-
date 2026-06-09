import ImageKit from 'imagekit';

let imagekit = null;

export const getImageKit = () => {
  if (!imagekit) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      return null;
    }

    imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
  }
  return imagekit;
};

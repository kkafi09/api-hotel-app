import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
});

const uploadImageKit = async (file: Express.Multer.File, folder: string) => {
  const uploadResult = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: `hotel-ukl/${folder}`
  });
  return uploadResult;
};

export { uploadImageKit, imagekit };

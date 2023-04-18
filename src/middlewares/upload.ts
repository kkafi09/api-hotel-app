import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: 'your-public-key',
  privateKey: 'your-private-key',
  urlEndpoint: 'https://your-url-endpoint'
});

const uploadImageKit = async (file: Express.Multer.File) => {
  const uploadResult = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname
  });
  return uploadResult;
};

export { uploadImageKit, imagekit };

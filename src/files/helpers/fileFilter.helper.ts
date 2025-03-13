type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension: string = file.mimetype.split('/')[1] ?? '';
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};

import { v4 as uuid } from 'uuid';

type FileNamerCallback = (error: Error | null, fileName: string) => void;

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileNamerCallback,
) => {
  const fileExtension: string = file.mimetype.split('/')[1] ?? '';

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};

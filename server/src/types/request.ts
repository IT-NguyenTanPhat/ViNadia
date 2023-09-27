import { Request } from 'express';

export type MulterRequest = Request & {
  file?: any;
  files?: any;
};

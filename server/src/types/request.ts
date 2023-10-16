import { Request } from 'express';

export type VerifiedRequest = Request & {
  userId?: string;
};

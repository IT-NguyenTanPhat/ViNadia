import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';

export const errorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.rmSync(req.file.path);

    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

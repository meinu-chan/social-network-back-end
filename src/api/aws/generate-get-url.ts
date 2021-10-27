import { NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { generateGetUrl } from '../../services/s3';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = matchedData(req, { locations: ['body'] });

    const url = await generateGetUrl(body.key);

    return res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

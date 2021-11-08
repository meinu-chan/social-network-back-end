import { NextFunction, Response } from 'express';
import { matchedData } from 'express-validator';
import { generateGetUrl } from '../../services/s3';
import { TypedRequest } from '../../types/common/request';
import { IAWSGenerateGetUrlResponse } from '../../types/response/aws/generate-get-url';

interface IBody {
  key: string;
}

export default async (
  req: TypedRequest<{ body: IBody }>,
  res: Response<IAWSGenerateGetUrlResponse>,
  next: NextFunction,
) => {
  try {
    const body = matchedData(req, { locations: ['body'] }) as IBody;

    const url = await generateGetUrl(body.key);

    return res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

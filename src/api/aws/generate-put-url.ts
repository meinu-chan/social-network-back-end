import { NextFunction, Response } from 'express';
import { matchedData } from 'express-validator';
import { generatePutUrl } from '../../services/s3';
import { TypedRequest } from '../../types/common/request';
import { IAWSGeneratePutUrlResponse } from '../../types/response/aws/generate-put-url';

interface IBody {
  key: string;
  contentType: string;
}

export default async (
  req: TypedRequest<{ body: IBody }>,
  res: Response<IAWSGeneratePutUrlResponse>,
  next: NextFunction,
) => {
  try {
    const body = matchedData(req, { locations: ['body'] }) as IBody;

    const url = await generatePutUrl(body.key, body.contentType);

    return res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

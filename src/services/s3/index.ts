import AWS from 'aws-sdk';
import { aws } from '../../config/packages';

AWS.config = new AWS.Config({
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
  region: aws.region,
});

const s3 = new AWS.S3();

export const generateGetUrl = (Key: string) =>
  s3.getSignedUrlPromise('getObject', {
    Bucket: aws.bucket,
    Key,
    Expires: aws.urlExpiration,
  });

export const generateStaticUrl = (Key: string) =>
  s3.getSignedUrlPromise('getObject', {
    Bucket: aws.bucket,
    Key,
  });

export const generatePutUrl = (Key: string, ContentType: string) =>
  s3.getSignedUrlPromise('putObject', {
    Bucket: aws.bucket,
    Key,
    ContentType,
  });

export const deleteObject = (Key: string) => s3.deleteObject({ Bucket: aws.bucket, Key });

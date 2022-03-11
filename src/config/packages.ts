import { port } from '.';
import { requireEnv } from './helpers';

export const mongo = {
  uri: process.env.MONGO_URI || 'mongodb://localhost/development-social-network',
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      // API informations (required)
      title: 'Social Network 1.0', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'CRUD API', // Description (optional)
    },
    servers: [
      { url: `http://localhost:${port}` },
      { url: 'https://social-network-back-end.herokuapp.com/' },
    ],
  },
  apis: ['./**/*.ts'],
};

export const aws = {
  accessKeyId: requireEnv('S3_KEY'),
  secretAccessKey: requireEnv('S3_SECRET'),
  region: requireEnv('BUCKET_REGION'),
  bucket: requireEnv('BUCKET_NAME'),
  urlExpiration: Number(process.env.AWS_URL_EXPIRATION) || 2 * 60 * 60,
};

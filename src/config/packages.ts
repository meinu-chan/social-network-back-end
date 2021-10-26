import { port } from '.';

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
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./**/*.ts'],
};

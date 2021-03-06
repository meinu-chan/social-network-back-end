import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { cors as corsOptions, env } from './config';
import { swaggerOptions } from './config/packages';

import swaggerUi from 'swagger-ui-express';
import swaggerJsDocs from 'swagger-jsdoc';

import cors from 'cors';
import helmet from 'helmet';
import globalErrorHandler from './lib/errors';
import api from './api';

process.on('uncaughtException', (e: Error) => {
  // eslint-disable-next-line no-console
  console.log('ERROR', e);
});

const app: express.Express = express();

app.use(cors(corsOptions));

app.get('/', (req: express.Request, res: express.Response) => res.send('Social Network API!'));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(helmet());

if (env !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs(swaggerOptions)));
}

app.use('/api/v1', api);

app.use((req: express.Request, res: express.Response) => res.sendStatus(404));

app.use(globalErrorHandler);

export default app;

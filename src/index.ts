/* eslint-disable no-console */
import { port } from './config';
import { mongo } from './config/packages';
import app from './app';
import mongoose from 'mongoose';
import { wsServer } from './services/socket';

mongoose.set('debug', true);

mongoose
  .connect(mongo.uri, mongo.options)
  .then(() => {
    const server = app
      .listen(port, () => {
        console.info(`Server running on port : ${port}`);
      })
      .on('error', (e) => console.error(e));

    if (process.env.NODE_ENV !== 'test') wsServer(server);
  })
  .catch((err) => {
    console.error(err);
  });

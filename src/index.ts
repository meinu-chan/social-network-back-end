/* eslint-disable no-console */
import { port } from './config';
import { mongo } from './config/packages';
import app from './app';
import mongoose from 'mongoose';

mongoose.set('debug', true);

mongoose
  .connect(mongo.uri, mongo.options)
  .then(() => {
    app
      .listen(port, () => {
        console.info(`Server running on port : ${port}`);
      })
      .on('error', (e) => console.error(e));
  })
  .catch((err) => {
    console.error(err);
  });

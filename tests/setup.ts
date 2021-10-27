import { mongo } from '../src/config/packages';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(90000);

const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  const mongoUri = await mongoServer.getUri();

  await mongoose.connect(mongoUri, mongo.options);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  const promises: any = [];
  Object.keys(collections).forEach((collection) => {
    promises.push(collections[collection].deleteMany({}));
  });
  await Promise.all(promises);
});

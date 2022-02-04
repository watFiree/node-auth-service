import mongoose from "mongoose";
import { ValidationError } from "express-validator";
import connectToMongoDB from "./connectToDatabase";

const clearAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);

  for (const collection of collections) {
    await mongoose.connection.collection(collection).deleteMany({});
  }
};

const connectToTestingDatabase = async () => await connectToMongoDB("testing");

export const createTestingEnv = () => {
  beforeAll(async () => await connectToTestingDatabase());

  beforeEach(async () => {
    await clearAllCollections();
  });

  afterAll(async () => {
    await clearAllCollections();
    await mongoose.connection.close();
  });
};

export const transformErrorsArray = (errors: ValidationError[]) =>
  errors.map((error) => `${error.param} - ${error.msg}`);

export default createTestingEnv;

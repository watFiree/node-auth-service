import mongoose from "mongoose";
import chalk from "chalk";

export function connectToDatabase(databaseName?: string) {
  const db = mongoose.connection;

  mongoose.connect(process.env.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  });

  db.on("error", (error) => {
    console.error(chalk.bgRed(`MongoDB connection error: ${error.message}`));
  });
  db.once("open", () =>
    console.log(chalk.green("Successfully connected to MongoDB."))
  );

  return db;
}

export default connectToDatabase;

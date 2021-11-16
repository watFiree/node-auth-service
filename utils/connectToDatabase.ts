import mongoose from "mongoose";
import chalk from "chalk";

const connectToDatabase = (databaseName?: string) =>
  new Promise<mongoose.Connection>((resolve, reject) => {
    const db = mongoose.connection;
    console.log(chalk.yellow("Connecting to MongoDB..."));

    db.openUri(process.env.MONGODB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: databaseName || process.env.MONGODB_DB_NAME,
    });

    db.on("error", (error) => {
      const closeConnection = () => {
        db.close();
        throw new Error(
          chalk.bgRed(`MongoDB connection error: ${error.message}`)
        );
      };

      reject(closeConnection());
    });

    db.once("open", () => {
      console.log(chalk.green("Successfully connected to MongoDB."));
      resolve(db);
    });
  });

export default connectToDatabase;

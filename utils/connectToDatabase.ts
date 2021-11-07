import mongoose from "mongoose";
import chalk from "chalk";

const connectToDatabase = new Promise((resolve, reject) => {
  const db = mongoose.connection;
  console.log(chalk.yellow("Connecting to MongoDB..."));

  db.openUri(process.env.MONGODB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGOFB_DB_NAME,
  });

  db.on("error", (error) => {
    db.close();
    reject(
      new Error(chalk.bgRed(`MongoDB connection error: ${error.message}`))
    );
  });

  db.once("open", () => {
    resolve(console.log(chalk.green("Successfully connected to MongoDB.")));
  });
});

export default connectToDatabase;

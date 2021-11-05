import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import Routes from "./routes";

export const app = express();

app.use(express.json(), cors(), cookieParser(), morgan("tiny"));

app.use("/api/auth", Routes.authRouter);

export default app;

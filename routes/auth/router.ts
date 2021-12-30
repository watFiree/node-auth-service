import express from "express";
import Controller from "controllers/auth";
import * as V from "./validators";

const authRouter = express.Router();

authRouter.route("/register").post(V.isNewUserValid, Controller.register);

authRouter.route("/login").post(V.isLoggedUserValid, Controller.login);

authRouter.route("/token").get(Controller.silentRefresh);

export default authRouter;

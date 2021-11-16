import { Request, Response } from "express";
import { createToken, verifyToken } from "../../utils/jwt";
import { hashPassword } from "../../utils/hashPassword";
import * as C from "./constants";
import * as H from "./helpers";
import User from "../../models/User";

export const authController = {
  register: async (req: C.RegisterRequest, res: Response) => {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      const createdUser = await new User({
        username,
        email,
        password: hashedPassword,
      });

      const accessToken = await createToken({
        id: createdUser.id,
        username,
        email,
      });

      const refreshToken = await createToken(
        { id: createdUser.id, username, email },
        "long"
      );

      createdUser["refreshToken"] = refreshToken.token;
      await createdUser.save();

      const returnData = {
        ...H.transformUserData(createdUser),
        ...accessToken,
      };

      return res
        .status(201)
        .cookie("refresh_token", refreshToken.token, { httpOnly: true })
        .send(returnData);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  login: async (req: C.LoginRequest, res: Response) => {
    const { username, email } = req.body;
    try {
      const user = await User.findOne({ email });
      //TODO: check whether refreshToken is still valid and if not, update it
      const accessToken = await createToken({
        id: user.id,
        username,
        email,
      });

      const returnData = {
        ...H.transformUserData(user),
        ...accessToken,
      };

      return res
        .status(200)
        .cookie("refresh_token", user.get("refreshToken"), { httpOnly: true })
        .send(returnData);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  silentRefresh: async (req: Request, res: Response) => {
    const refreshTokenCookie = req.cookies["refresh_token"];
    const errorMessage = {
      message: "Could not authenticate user. Log in again.",
    };

    try {
      const refreshToken = await verifyToken(refreshTokenCookie);
      if (!refreshToken) {
        return res.status(401).send(errorMessage);
      }

      const user = await User.findById(refreshToken.id);
      if (!user || refreshTokenCookie !== user.get("refreshToken")) {
        return res.status(401).send(errorMessage);
      }

      const { id, username, email } = user["_doc"];
      const accessToken = await createToken({ id, username, email });

      const returnData = {
        ...H.transformUserData(user),
        ...accessToken,
      };

      return res.status(200).send(returnData);
    } catch (error) {
      return res.status(401).send(error);
    }
  },
};

export default authController;

import { Request, Response } from "express";
import { createToken, verifyJwtToken } from "utils/jwt";
import User from "models/User";
import * as H from "./helpers";
import * as C from "./constants";

export const authController = {
  register: async (req: C.RegisterRequest, res: Response) => {
    const { username, email, password } = req.body;

    try {
      const createdUser = await new User({
        username,
        email,
        password,
      });

      const accessToken = await createToken({
        id: createdUser.id,
        username,
        email,
      });

      await createdUser.save();

      const returnData = {
        ...H.transformUserData(createdUser),
        ...accessToken,
      };

      return res
        .status(201)
        .cookie("refresh_token", createdUser.get("refreshToken"), {
          httpOnly: true,
        })
        .send(returnData);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  login: async (req: C.LoginRequest, res: Response) => {
    const { username, email } = req.body;
    try {
      const user = await User.findOne({ email });

      const verifiedRefreshToken = await verifyJwtToken(
        user.get("refreshToken")
      );

      if (verifiedRefreshToken instanceof Error) {
        const newRefreshToken = await createToken(
          { id: user.id, username, email },
          "long"
        );

        user["refreshToken"] = newRefreshToken.token;
        await user.save();
      }

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
    const errorMessage = {
      message: "Could not authenticate user. Log in again.",
    };

    const refreshTokenFromCookie = req.cookies["refresh_token"];
    if (!refreshTokenFromCookie.length) {
      return res.status(401).send(errorMessage);
    }

    try {
      const refreshToken = await verifyJwtToken(refreshTokenFromCookie);
      if (refreshToken instanceof Error) {
        return res.status(401).send(errorMessage);
      }

      const user = await User.findById(refreshToken.id);
      if (refreshTokenFromCookie !== user.get("refreshToken")) {
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

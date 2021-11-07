import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "";

export const createToken = async (
  data: object,
  type: "short" | "long" = "short"
) => {
  const expiration = type === "short" ? "15m" : "200d";
  const token = await jwt.sign(data, JWT_SECRET, { expiresIn: expiration });
  const { exp } = (await verifyToken(token)) as JwtPayload;

  return { token, expiration: exp };
};

export const verifyToken = async (token: string) =>
  (await jwt.verify(token, JWT_SECRET)) as JwtPayload;

export const decodeToken = async (token: string) => await jwt.decode(token);

export default { createToken, verifyToken, decodeToken };

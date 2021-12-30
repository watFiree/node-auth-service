import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "";

export const createToken = async (
  data: object,
  type: "short" | "long" = "short"
) => {
  const expiration = type === "short" ? "15m" : "1m";
  const token = await jwt.sign(data, JWT_SECRET, { expiresIn: expiration });
  const { exp } = (await verifyJwtToken(token)) as JwtPayload;

  return { token, expiration: exp };
};

export const verifyJwtToken = async (token: string) => {
  try {
    return (await jwt.verify(token, JWT_SECRET)) as JwtPayload;
  } catch (error) {
    return error as Error;
  }
};

export default { createToken, verifyJwtToken };

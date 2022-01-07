import { Document } from "mongoose";

export interface UserSchemaInterface extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: string;
}

import { Schema, model } from "mongoose";
import { hashPassword } from "utils/hashPassword";
import { createToken } from "utils/jwt";
import { UserSchemaInterface } from "./constants";

const userSchema = new Schema(
  {
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserSchemaInterface>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const { id, username, email, password } = this;

  const hashedPassword = await hashPassword(password);
  this.password = hashedPassword;

  const refreshToken = await createToken({ id, username, email }, "long");
  this.refreshToken = refreshToken.token;
});

export default model("User", userSchema, "users");

import { Schema, model } from "mongoose";
import { hashPassword } from "utils/hashPassword";
import { UserSchemaInterface } from "./constants";

const userSchema = new Schema(
  {
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserSchemaInterface>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await hashPassword(this.password);
  this.password = hashedPassword;
});

export default model("User", userSchema, "users");

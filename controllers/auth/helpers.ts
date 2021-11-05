import { Document } from "mongoose";

export const transformUserData = (userDoc: Document) =>
  userDoc.toObject({
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
      delete ret.refreshToken;
    },
  });

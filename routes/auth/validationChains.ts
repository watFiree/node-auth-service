import { check } from "express-validator";
import { comparePasswords } from "../../utils/hashPassword";
import User from "../../models/User";

export const isAlreadyInUse = (fieldName: string, errorMessage?: string) =>
  check(fieldName).custom(async (value: string) => {
    const user = await User.findOne({ [fieldName]: value });
    if (user) {
      return Promise.reject(
        errorMessage ||
          `${
            fieldName[0].toUpperCase() + fieldName.slice(1)
          } is already in use.`
      );
    }

    return true;
  });

export const arePasswordsEqual = () =>
  check("passwordConfirmation")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation cannot be empty.")
    .custom((value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password.");
      }

      return true;
    });

export const isUsernameValid = () =>
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required.");

export const isEmailValid = () =>
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please enter a valid email.");

export const isPasswordValid = () =>
  check("password")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isStrongPassword({ minLength: 6, minLowercase: 0, minSymbols: 0 })
    .withMessage(
      "Password must be at least 6 characters long and contains minimum 1 uppercase letter and number."
    );

export const doesUserExist = () =>
  check("email").custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (!user) {
      return Promise.reject("User with this email does not exist.");
    }

    return true;
  });

export const isPasswordCorrect = () =>
  check("password").custom(async (value, { req }) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return Promise.reject("Error: User not found.");
    }

    const isCorrect = await comparePasswords(value, user.get("password"));
    if (!isCorrect) {
      return Promise.reject("Incorrect password.");
    }

    return true;
  });

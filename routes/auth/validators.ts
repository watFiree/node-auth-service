import * as VC from "./validationChains";
import { resolveErrors } from "../../validation/helpers";

export const isNewUserValid = [
  VC.isUsernameValid(),
  VC.isEmailValid(),
  VC.isPasswordValid(),
  VC.arePasswordsEqual(),
  VC.isAlreadyInUse("username"),
  VC.isAlreadyInUse("email"),
  resolveErrors,
];

export const isLoggedUserValid = [
  VC.isUsernameValid(),
  VC.isEmailValid(),
  VC.isPasswordValid(),
  VC.doesUserExist(),
  VC.isPasswordCorrect(),
  resolveErrors,
];

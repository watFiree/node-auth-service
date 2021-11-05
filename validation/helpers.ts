import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const resolveErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  next();
};

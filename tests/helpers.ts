import User from "models/User";
import * as M from "./mockData";

export const createAndSaveUser = async (
  data = M.mockedUserWithCorrectInput
) => {
  const user = await new User(data);
  await user.save();

  return user;
};

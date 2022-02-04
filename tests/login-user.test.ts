import createTestingEnv, { transformErrorsArray } from "utils/testingUtils";
import request from "supertest";
import app from "app";
import * as M from "./mockData";
import { createAndSaveUser } from "./helpers";

describe("POST /login", () => {
  createTestingEnv();

  it("should login user and respond with refresh token and code 200", async () => {
    const userInput = {
      username: "username",
      email: "mojmejl@it.pl",
      password: "password123A",
      passwordConfirmation: "password123A",
      refreshToken: "dasd2d",
    };

    await createAndSaveUser(userInput);

    const response = await request(app).post("/api/auth/login").send(userInput);

    expect(response.statusCode).toEqual(200);
    expect(
      response.headers["set-cookie"][0]?.includes("refresh_token")
    ).toBeTruthy();
    expect(response.body.username).toEqual(userInput.username);
    expect(response.body.email).toEqual(userInput.email);
    expect(response.body).toHaveProperty("token");
  });

  it("should return error if user does not exists", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send(M.mockedUserWithCorrectInput);

    expect(response.statusCode).toEqual(422);
    expect(transformErrorsArray(response.body.errors)).toMatchInlineSnapshot(`
Array [
  "email - User with this email does not exist.",
  "password - Error: User not found.",
]
`);
  });

  it("should return error if password does not match users", async () => {
    const registerData = {
      ...M.mockedUserWithCorrectInput,
      refreshToken: M.mockedRefreshToken,
    };

    await createAndSaveUser(registerData);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ ...registerData, password: "NotWorking1ONE" });

    expect(response.statusCode).toEqual(422);
    expect(transformErrorsArray(response.body.errors)).toMatchInlineSnapshot(`
Array [
  "password - Incorrect password.",
]
`);
  });
});

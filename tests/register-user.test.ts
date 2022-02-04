import createTestingEnv, { transformErrorsArray } from "utils/testingUtils";
import request from "supertest";
import app from "app";
import { createAndSaveUser } from "./helpers";
import * as M from "./mockData";

describe("POST /register", () => {
  createTestingEnv();

  it("should create user and respond with refresh token and code 201", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(M.mockedUserWithCorrectInput);

    expect(response.statusCode).toEqual(201);
    expect(
      response.headers["set-cookie"][0]?.includes("refresh_token")
    ).toBeTruthy();
    expect(response.body.username).toEqual(
      M.mockedUserWithCorrectInput.username
    );
    expect(response.body.email).toEqual(M.mockedUserWithCorrectInput.email);
  });

  it("should return errors for wrong fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(M.mockedUserWithIncorrectInput);

    expect(response.statusCode).toEqual(422);
    expect(transformErrorsArray(response.body.errors)).toMatchInlineSnapshot(`
Array [
  "username - Minimum 3 characters required.",
  "email - Please enter a valid email.",
  "password - Password must be at least 6 characters long and contains minimum 1 uppercase letter and number.",
  "passwordConfirmation - Password confirmation does not match password.",
]
`);
  });

  it("should return error when user already exists", async () => {
    await createAndSaveUser();

    const response = await request(app)
      .post("/api/auth/register")
      .send(M.mockedUserWithCorrectInput);

    expect(response.statusCode).toEqual(422);
    expect(transformErrorsArray(response.body.errors)).toMatchInlineSnapshot(`
Array [
  "username - Username is already in use.",
  "email - Email is already in use.",
]
`);
  });
});

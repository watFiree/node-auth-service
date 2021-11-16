import request from "supertest";
import app from "../../../app";
import createTestingEnv from "../../../utils/testingUtils";
import * as M from "./mockData";

describe("POST /register", () => {
  createTestingEnv();

  it("should create user and respond with 201", (done) => {
    request(app)
      .post("/api/auth/register")
      .send(M.mockedUserWithCorrectInput)
      .expect(201, done);
  });
});

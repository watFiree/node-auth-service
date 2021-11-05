import request from "supertest";
import app from "../../../app";
import * as M from "./mockData";

describe("POST /register", () => {
  it("should create user and respond with 201", (done) => {
    request(app)
      .post("/api/auth/register")
      .send(M.mockUsersCorrectInput)
      .expect(201, done);
  });
});

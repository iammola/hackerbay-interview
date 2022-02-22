import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import chai, { assert, expect } from "chai";

import type { Response } from "superagent";

chai.use(chaiHttp);

const base = "http://localhost:8125";

describe("Resource Not Found - Routes require trailing slash - API tests", () => {
  it("POST /api/auth - should return a 404 error", async () => {
    const res = await chai.request(base).post("/api/auth");
    checkResponse(res, "/api/auth");
  });

  it("POST /api/patch - should return a 404 error", async () => {
    const res = await chai.request(base).post("/api/patch");
    checkResponse(res, "/api/patch");
  });

  it("POST /api/thumbnail - should return a 404 error", async () => {
    const res = await chai.request(base).post("/api/thumbnail");
    checkResponse(res, "/api/thumbnail");
  });
});

function checkResponse(res: Response, route: string) {
  expect(res).to.have.status(404);
  assert.deepEqual(res.body, {
    code: "ResourceNotFound",
    message: `${route} does not exist`,
  });
}

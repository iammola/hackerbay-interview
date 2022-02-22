import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import chai, { assert, expect } from "chai";

import type { Response } from "superagent";

chai.use(chaiHttp);

const base = "http://localhost:8125";

describe("Method Not Allowed - Only POST request are allowed - API tests", () => {
  it("GET /api/auth/ - should return a 405 error", async () => {
    const res = await chai.request(base).get("/api/auth/");
    checkResponse(res);
  });

  it("GET /api/patch/ - should return a 405 error", async () => {
    const res = await chai.request(base).get("/api/patch/");
    checkResponse(res);
  });

  it("GET /api/thumbnail/ - should return a 405 error", async () => {
    const res = await chai.request(base).get("/api/thumbnail/");
    checkResponse(res);
  });
});

function checkResponse(res: Response) {
  expect(res).to.have.status(405);
  assert.deepEqual(res.body, {
    code: "MethodNotAllowed",
    message: "GET is not allowed",
  });
}

import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import chai, { assert, expect } from "chai";

import type { Response } from "superagent";

chai.use(chaiHttp);

const base = "http://localhost:8125";

describe("Unauthorized - An Authorization Bearer header with a JWT token is required - API tests", () => {
  it("POST /api/patch/ - should return a 401 error", async () => {
    const res = await chai.request(base).post("/api/patch/");
    checkResponse(res);
  });

  it("POST /api/thumbnail/ - should return a 401 error", async () => {
    const res = await chai.request(base).post("/api/thumbnail/");
    checkResponse(res);
  });
});

function checkResponse(res: Response) {
  expect(res).to.have.status(401);
  expect(res.body).to.be.a("object");
  assert.include(res.body, { code: "Unauthorized" });
}

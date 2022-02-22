import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import chai, { assert, expect } from "chai";

import { JWT_TOKEN_NAME } from "../src/utils";

import type { PatchObject } from "../src/types";

chai.use(chaiHttp);

let token = "";
const base = "http://localhost:8125";

describe("API tests", () => {
  const agent = chai.request.agent(base);

  // /api/auth/
  it("Should return a JWT token", async () => {
    const res = await agent.post("/api/auth/").send({
      username: "iammola",
      password: "pwd.dev",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    expect(res).to.have.cookie(JWT_TOKEN_NAME);

    token = (res.body as { token: string }).token;
  });

  it("Should complain about username and password", async () => {
    const res = await agent.post("/api/auth/").send({});

    expect(res).to.have.status(400);
    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Missing properties",
    });
  });

  // /api/patch/
  it("Should return patched object", async () => {
    const doc = {
      breakfast: {
        drink: ["coffee", "tea", "milk", "soda"],
        meal: ["salad", "eggs", "pasta", "toast"],
      },
      lunch: {
        where: "home",
        time: "evening",
        drink: ["soda", "water"],
        meal: ["chicken", "chips", "rice"],
      },
    };
    const patch: PatchObject[] = [
      {
        op: "replace",
        value: "water",
        path: "/breakfast/drink/3",
      },
      {
        op: "remove",
        path: "/breakfast/meal/2",
      },
      {
        op: "replace",
        path: "/lunch/time",
        value: "afternoon",
      },
      {
        op: "add",
        path: "/breakfast/time",
        value: "morning",
      },
      {
        op: "add",
        path: "/lunch/drink/-",
        value: "juice",
      },
      {
        op: "copy",
        from: "/lunch/where",
        path: "/breakfast/where",
      },
    ];

    const res = await agent
      .post("/api/patch/")
      .auth(token, { type: "bearer" })
      .send({ doc, patch });

    assert.deepEqual(res.body, {
      result: {
        breakfast: {
          where: "home",
          time: "morning",
          drink: ["coffee", "tea", "milk", "water"],
          meal: ["salad", "eggs", "toast"],
        },
        lunch: {
          where: "home",
          time: "afternoon",
          drink: ["soda", "water", "juice"],
          meal: ["chicken", "chips", "rice"],
        },
      },
    });
  });

  it("Should complain about original document", async () => {
    const res = await agent
      .post("/api/patch/")
      .auth(token, { type: "bearer" })
      .send({ patch: [] });

    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Invalid Document Type",
    });
  });

  it("Should complain about patch document", async () => {
    const res = await agent
      .post("/api/patch/")
      .auth(token, { type: "bearer" })
      .send({ doc: {} });

    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Expected patch to be array",
    });
  });

  it("Should complain about patch fields", async () => {
    const res = await agent
      .post("/api/patch/")
      .auth(token, { type: "bearer" })
      .send({
        doc: {},
        patch: [
          {
            op: "add",
            path: "money",
            value: "broke",
          },
        ],
      });

    assert.include(res.body, {
      code: "Bad Request",
    });
  });

  // /api/thumbnail/
  it("Should return the minified image", async () => {
    const res = await agent
      .post("/api/thumbnail/")
      .auth(token, { type: "bearer" })
      .send({
        url: "https://raw.githubusercontent.com/hackerbay/interview/master/companylogo.png",
      });

    expect(res).to.have.status(200);
    expect(res).to.have.header("content-type", /^image\//);
  });

  it("Should return the minified images as JPG", async () => {
    const res = await agent
      .post("/api/thumbnail/")
      .auth(token, { type: "bearer" })
      .send({
        format: "jpg",
        url: "https://raw.githubusercontent.com/hackerbay/interview/master/companylogo.png",
      });

    expect(res).to.have.status(200);
    expect(res).to.have.header("content-type", "image/jpeg");
  });

  it("Should reject because of invalid format type", async () => {
    const res = await agent
      .post("/api/thumbnail/")
      .auth(token, { type: "bearer" })
      .send({
        format: "mp4",
        url: "https://raw.githubusercontent.com/hackerbay/interview/master/companylogo.png",
      });

    expect(res).to.have.status(400);
    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Invalid Format Type",
    });
  });

  it("Should reject Non-Image URL", async () => {
    const res = await agent
      .post("/api/thumbnail/")
      .auth(token, { type: "bearer" })
      .send({
        url: "https://github.com/hackerbay/interview/raw/master/software-backend-task.md",
      });

    expect(res).to.have.status(400);
    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Resource is not an image",
    });
  });

  it("Should reject URL", async () => {
    const res = await agent
      .post("/api/thumbnail/")
      .auth(token, { type: "bearer" })
      .send({
        url: "",
      });

    expect(res).to.have.status(400);
    assert.deepEqual(res.body, {
      code: "Bad Request",
      message: "Invalid URL",
    });
  });

  agent.close();
});

import * as jose from "jose";
import { StatusCodes } from "http-status-codes";

import { JWT_ALG, JWT_TOKEN_NAME, routeWrapper } from "../utils";

import type { AuthRequestBody } from "../types";
import type { Request, Response } from "restify";

export const authUser = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler({ body }: Request, res: Response) {
  if (typeof body !== "string") throw new Error("Invalid Body");

  const data = JSON.parse(body) as AuthRequestBody;
  if (!data.username || !data.password) throw new Error("Missing properties");

  const { privateKey, publicKey } = await jose.generateKeyPair(JWT_ALG);

  const jwt = await new jose.SignJWT(data)
    .setIssuedAt()
    .setProtectedHeader({
      typ: "JWT",
      alg: JWT_ALG,
    })
    .sign(privateKey);

  res.status(StatusCodes.OK);
  res.setCookie(JWT_TOKEN_NAME, await jose.exportSPKI(publicKey), {
    path: "/api",
  });
  res.json({ jwt });
}

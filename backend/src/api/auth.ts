import * as jose from "jose";
import { StatusCodes } from "http-status-codes";

import { JWT_ALG, JWT_TOKEN_NAME, log, routeWrapper } from "../utils";

import type { AuthRequestBody } from "../types";
import type { Request, Response } from "restify";

/**
 * @description Send a POST request to the `/api/auth/` route with a username and password, and get a JWT token to authenticate other routes
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @see https://jwt.io/
 */
export const authUser = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

/**
 * Checks if required fields are provided before generating JWT token and storing publicKey in the cookies
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @throws {Error} If `req.body` is missing any properties (username or password)
 */
async function handler({ body }: Request, res: Response) {
  const start = log.start(" /api/auth/ - Request for JWT Token");

  const data = (
    typeof body === "string" ? JSON.parse(body) : body || {}
  ) as AuthRequestBody;

  if (!data.username || !data.password) {
    log.error("Missing username and/or password fields");
    throw new Error("Missing properties");
  }

  log.info("Generating keys...");
  const { privateKey, publicKey } = await jose.generateKeyPair(JWT_ALG);

  log.info(`Generating token for "${data.username}"`);
  const token = await new jose.SignJWT(data)
    .setIssuedAt()
    .setProtectedHeader({
      typ: "JWT",
      alg: JWT_ALG,
    })
    .sign(privateKey);

  log.info("Storing key to cookies");
  res.status(StatusCodes.OK);
  res.setCookie(JWT_TOKEN_NAME, await jose.exportSPKI(publicKey), {
    path: "/api",
  });
  res.json({ token });

  log.end(start, "Success");
}

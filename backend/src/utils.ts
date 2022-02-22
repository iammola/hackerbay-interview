import { errors, jwtVerify, importSPKI } from "jose";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { Request, Response } from "restify";

export const JWT_ALG = "PS256";
export const JWT_TOKEN_NAME = "hackerbay-jwt";

/**
 * @param req HTTP Request
 * @param res HTTP Response
 * @param routerHandler Endpoints handler
 */
export async function routeWrapper(
  req: Request,
  res: Response,
  routerHandler: (req: Request, res: Response) => Promise<void>
) {
  try {
    await routerHandler(req, res);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({
      message: ReasonPhrases.BAD_REQUEST,
      error: (error as { message: string }).message,
    });
  }
}

/**
 * Validate JWT token
 * Throws a JWSSignatureVerificationFailed error if verification fails
 * @param req HTTP Request
 */
export async function validateJWT({ headers, cookies }: Request) {
  try {
    const [type, token] = (headers.authorization ?? "").split(" ");
    if (type !== "Bearer") throw new Error("Invalid authorization header");

    const key = (cookies as Partial<Record<string, string>>)[JWT_TOKEN_NAME];
    if (typeof key !== "string") throw new Error("You need to be signed in");

    await jwtVerify(token, await importSPKI(key, JWT_ALG));
  } catch (error) {
    if (error instanceof errors.JWSSignatureVerificationFailed)
      throw new Error("Invalid authorization token");
    throw new Error((error as { message: string }).message);
  }
}

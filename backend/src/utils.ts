import { errors, jwtVerify, importSPKI } from "jose";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { Request, Response } from "restify";

export const JWT_ALG = "PS256";
export const JWT_TOKEN_NAME = "hackerbay-jwt";

/**
 * Catches all errors thrown in a route and formats the response to the client
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
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
      code: ReasonPhrases.BAD_REQUEST,
      message: (error as { message: string }).message,
    });
  }
}

/**
 * Validate JWT token
 *
 * Checks for a `publicKey` stored in the cookies and uses it to decrypt the `JWT` token provided in the `Authorization` header
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @throws {@link errors.JWSSignatureVerificationFailed} if Authorization Bearer header is invalid
 */
export async function validateJWT(
  { headers, cookies }: Request,
  res: Response
) {
  try {
    const [type, token] = (headers.authorization ?? "").split(" ");
    if (type !== "Bearer") throw new Error("Invalid authorization header");

    const key = (cookies as Partial<Record<string, string>>)[JWT_TOKEN_NAME];
    if (typeof key !== "string") throw new Error("You need to be signed in");

    await jwtVerify(token, await importSPKI(key, JWT_ALG));
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json({
      code: ReasonPhrases.UNAUTHORIZED,
      message:
        error instanceof errors.JWSSignatureVerificationFailed
          ? "Invalid Authorization token"
          : (error as { message: string }).message,
    });
    return true;
  }
}

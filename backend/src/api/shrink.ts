import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";

export const shrinkImage = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  await validateJWT(req);

  res.status(StatusCodes.OK);
}

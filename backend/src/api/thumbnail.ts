import { got } from "got";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";

export const shrinkImageToThumbnail = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  const invalid = await validateJWT(req, res);
  if (invalid) return;

  if (typeof req.body !== "string") throw new Error("Invalid Body");

  const resizer = sharp().resize(50, 50);
  const { url } = JSON.parse(req.body) as { url: string };
  got
    .stream(new URL(url))
    .pipe(resizer)
    .pipe(res)
    .on("close", () => res.end());

  res.status(StatusCodes.OK);
}

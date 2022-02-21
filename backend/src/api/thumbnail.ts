import { got } from "got";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";

export const shrinkImageToThumbnail = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  await validateJWT(req);
  if (typeof req.body !== "string") throw new Error("Invalid Body");

  const { url } = JSON.parse(req.body) as { url: string };
  if (!url) throw new Error("Invalid image URL");

  const resizer = sharp().resize(50, 50).toFormat("webp");
  got
    .stream(url)
    .pipe(resizer)
    .pipe(res)
    .on("close", () => res.end());

  res.status(StatusCodes.OK);
}

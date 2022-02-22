import { got } from "got";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";
import type { ThumbnailRequestBody } from "../types";

export const shrinkImageToThumbnail = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  const invalid = await validateJWT(req, res);
  if (invalid) return;

  const { url, format = "png" } = (
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}
  ) as ThumbnailRequestBody;

  const requestContentType =
    (await got.head(new URL(url))).headers["content-type"] ?? "";

  if (!/^image\//.test(requestContentType))
    throw new Error("Resource is not an image");

  const resizer = sharp().resize(50, 50).toFormat(format);

  got
    .stream(new URL(url))
    .pipe(resizer)
    .pipe(res)
    .on("close", () => res.end());

  res.status(StatusCodes.OK);
}

import { got } from "got";
import sharp, { FormatEnum } from "sharp";
import { contentType } from "mime-types";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";
import type { ThumbnailRequestBody } from "../types";

const formats = [
  ...["avif", "dz", "fits", "gif", "heif", "input", "jpeg", "jpg", "magick"],
  ...["openslide", "pdf", "png", "ppm", "raw", "svg", "tiff", "tif", "v"],
  "webp",
] as (keyof FormatEnum)[];

export const shrinkImageToThumbnail = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  const invalid = await validateJWT(req, res);
  if (invalid) return;

  const { url, format = "png" } = (
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}
  ) as ThumbnailRequestBody;

  if (!formats.includes(format)) throw new Error("Invalid Format Type");

  const requestContentType =
    (await got.head(new URL(url))).headers["content-type"] ?? "";

  if (!/^image\//.test(requestContentType))
    throw new Error("Resource is not an image");

  const resizer = sharp().resize(50, 50).toFormat(format);

  res.setHeader("Content-Type", contentType(format) || "image/png");

  got
    .stream(new URL(url))
    .pipe(resizer)
    .pipe(res)
    .on("close", () => res.end());

  res.status(StatusCodes.OK);
}

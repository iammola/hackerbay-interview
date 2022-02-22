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

/**
 * Send a POST request to the `/api/thumbnail` route with a link to an image and an optional return format, and the image will be scaled and sent to response
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @see https://jwt.io/
 */
export const shrinkImageToThumbnail = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

/**
 * Checks if request is authenticated before resizing the Image and streaming to response
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @throws {Error} If the requested return format is not supported
 * @throws {Error} If the URL provided doesn't serve an image
 */
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

import { pipeline } from "node:stream/promises";

// eslint-disable-next-line import/named
import { got, PlainResponse } from "got";
import { contentType } from "mime-types";
import sharp, { FormatEnum } from "sharp";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { Request, Response } from "restify";
import type { ThumbnailRequestBody } from "../types";

const formats = [
  ...["heif", "tif", "jpeg", "jpg", "raw"],
  ...["tiff", "avif", "webp", "gif", "png"],
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

  const readStream = got.stream(new URL(url), {
    throwHttpErrors: false,
  });

  readStream.on(
    "response",
    (r: PlainResponse) => void routeWrapper(req, res, async () => stream(r))
  );

  async function stream(streamResponse: PlainResponse) {
    const requestContentType = streamResponse.headers["content-type"] ?? "";

    if (!/^image\//.test(requestContentType)) {
      readStream.destroy();
      throw new Error("Resource is not an image");
    }

    res.status(StatusCodes.OK);
    res.setHeader("Content-Type", contentType(format) || "image/png");
    await pipeline(readStream, sharp().resize(50, 50).toFormat(format), res);
  }
}

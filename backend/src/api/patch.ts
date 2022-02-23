import { apply_patch } from "jsonpatch";
import { StatusCodes } from "http-status-codes";

import { log, routeWrapper, validateJWT } from "../utils";

import type { PatchRequestBody } from "../types";
import type { Request, Response } from "restify";

/**
 * Send a POST request to the `/api/patch/` route with a valid JSON object and an array of patches to apply to it.
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @see http://jsonpatch.com/
 */
export const patchBody = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

/**
 * Checks if request is authenticated before applying patch and sending response to client
 *
 * @param `{@link Request} req HTTP Request
 * @param `{@link Response} res HTTP Response
 *
 * @throws {Error} If the original document (`req.body.doc`) is not a valid Object.
 * @throws {Error} If the patch array (`req.body.patch`) is not an Array.
 * @throws {Error} If any of the operations in the patch array is invalid
 */
async function handler(req: Request, res: Response) {
  const start = log.start("/api/patch/ - JSON Patching");

  const invalid = await validateJWT(req, res);
  if (invalid) {
    log.error("Unauthorized request");
    return;
  }

  const { doc, patch } = (
    typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}
  ) as PatchRequestBody;
  if (typeof doc !== "object") {
    log.error("Invalid Document Type");
    throw new Error("Invalid Document Type");
  }
  if (!Array.isArray(patch)) {
    log.error("Expected patch to be an array");
    throw new Error("Expected patch to be an array");
  }

  log.info("Applying patch");
  const result = apply_patch(doc, patch);

  res.status(StatusCodes.OK);
  res.json({ result });

  log.end(start, "Success");
}

import { apply_patch } from "jsonpatch";
import { StatusCodes } from "http-status-codes";

import { routeWrapper, validateJWT } from "../utils";

import type { PatchRequestBody } from "../types";
import type { Request, Response } from "restify";

export const patchBody = (req: Request, res: Response) =>
  routeWrapper(req, res, handler);

async function handler(req: Request, res: Response) {
  const invalid = await validateJWT(req, res);
  if (invalid) return;

  if (typeof req.body !== "string") throw new Error("Invalid Body");

  const { doc, patch } = JSON.parse(req.body) as PatchRequestBody;
  if (typeof doc !== "object") throw new Error("Invalid Document Type");
  if (!Array.isArray(patch)) throw new Error("Expected patch to be array");

  const result = apply_patch(doc, patch);

  res.status(StatusCodes.OK);
  res.json({ result });
}

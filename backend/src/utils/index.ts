import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { Request, Response } from "restify";

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
      message: ReasonPhrases.BAD_REQUEST,
      error: (error as { message: string }).message,
    });
  }
}

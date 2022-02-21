import { parse } from "restify-cookies";
import { createServer, plugins } from "restify";

import { authUser, patchBody, shrinkImage } from "./api";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const server = createServer().use(parse).use(plugins.bodyParser());
server.listen(8125);
server.post("/api/auth/", authUser);
server.post("/api/patch/", patchBody);
server.post("/api/shrink/", shrinkImage);

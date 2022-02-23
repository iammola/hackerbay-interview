import { parse } from "restify-cookies";
import { createServer, plugins } from "restify";

import { log } from "./utils";
import { authUser, patchBody, shrinkImageToThumbnail } from "./api";

const server = createServer().use(parse).use(plugins.bodyParser());
server.listen(process.env.PORT || 8125, () => log.info("Server is live"));

server.post("/api/auth/", authUser);
server.post("/api/patch/", patchBody);
server.post("/api/thumbnail/", shrinkImageToThumbnail);

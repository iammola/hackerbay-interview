import { parse } from "restify-cookies";
import { createServer, plugins } from "restify";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const server = createServer().use(parse).use(plugins.bodyParser());
server.listen(8125);

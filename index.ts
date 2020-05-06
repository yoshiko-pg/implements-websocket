import * as http from "http";

import clientApp from "./client";
import serverApp from "./server";

const server = http.createServer();

clientApp(server);
serverApp(server);

server.listen(8080);

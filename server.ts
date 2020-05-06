import * as http from "http";
import * as crypto from "crypto";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const createKey = (clientKey: string) =>
  crypto
    .createHash("sha1")
    .update(clientKey + GUID)
    .digest("base64");

export default (server: http.Server) => {
  server.on("upgrade", function (req, socket, head) {
    socket.write(`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: ${createKey(req.headers["sec-websocket-key"])}

`);

    socket.on("data", (data) => {
      console.log("受信", data);
      data.forEach((d) => console.log(d));
      // TODO: Buffer parse
    });
    socket.on("close", (e) => {
      console.log("closed");
    });
  });
};

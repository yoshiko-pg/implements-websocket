import * as http from "http";
import * as crypto from "crypto";

import bufferParser from "./bufferParser";
import bufferCreator from "./bufferCreator";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const createKey = (clientKey: string) =>
  crypto
    .createHash("sha1")
    .update(clientKey + GUID)
    .digest("base64");

export default (server: http.Server) => {
  server.on("upgrade", function (req, socket) {
    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${createKey(req.headers["sec-websocket-key"])}`,
        "",
        "",
      ].join("\r\n")
    );

    socket.on("data", (data) => {
      const text = bufferParser(data);
      console.log("受信", text);

      setTimeout(() => {
        const message1 = bufferCreator(`メッセージ「${text}」を受信しました`);
        socket.write(message1);
      }, 300);

      setTimeout(() => {
        const message2 = bufferCreator(`文字数は ${text.length} 文字でした`);
        socket.write(message2);
      }, 600);
    });

    socket.on("close", (e) => {
      console.log("closed");
    });
  });
};

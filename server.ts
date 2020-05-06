import * as http from "http";

export default (server: http.Server) => {
  server.on("upgrade", function (req, socket, head) {
    console.log(req);
  });
};

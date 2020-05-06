import * as http from "http";

export default (server: http.Server) => {
  const clientScript = () => {
    const ws = new WebSocket("ws://localhost:8080");

    // 接続が開いたときのイベント
    ws.addEventListener("open", function (event) {
      ws.send("Hello Server!");
    });

    // メッセージの待ち受け
    ws.addEventListener("message", function (event) {
      console.log("message from server", event.data);
    });
  };

  server.on("request", function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>WS test</title>
  <meta http-equiv="Cache-Control" content="no-store" />
  <script>(${clientScript}())</script>
</head>
<body>
  <h1>WS test</h1>
  <p></p>
</body>
</html>
  `);
    res.end();
  });
};

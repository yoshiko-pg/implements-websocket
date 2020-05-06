import * as http from "http";

const clientScript = () => {
  const ws = new WebSocket("ws://localhost:8080");

  ws.addEventListener("open", function (event) {
    ws.send("hello");

    let count = 0;
    const id = setInterval(() => {
      count++;
      if (count > 10) {
        clearInterval(id);
        return;
      }
      ws.send(`message ${count}`);
    }, 1000);
  });

  // メッセージの待ち受け
  ws.addEventListener("message", function (event) {
    console.log("message from server", event.data);
  });
};

const html = `
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
`;

export default (server: http.Server) => {
  server.on("request", function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
};

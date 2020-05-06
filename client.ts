import * as http from "http";

const clientScript = () => {
  const ws = new WebSocket("ws://localhost:8080");
  const log = document.getElementById("log");
  const form = document.getElementById("form");
  const chat = document.getElementById("chat") as HTMLInputElement;

  // メッセージの待ち受け
  ws.addEventListener("message", function (event) {
    const li = document.createElement("li");
    li.innerText = `from server: ${event.data}`;
    log.appendChild(li);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ws.send(chat.value);
    chat.value = "";
  });
};

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>WS test</title>
  <meta http-equiv="Cache-Control" content="no-store" />
</head>
<body>
  <h1>WS test</h1>
  <form action="#" method="post" id="form">
    <input type="text" name="chat" id="chat" style="width: 50%;" />
    <button>送信</button>
  </form>
  <ul id="log">
  </ul>
  <script>(${clientScript}())</script>
</body>
</html>
`;

export default (server: http.Server) => {
  server.on("request", function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
};

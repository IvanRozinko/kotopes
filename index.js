const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });

  res.end(`
    <h1>Node.js працює на app.kotopes.kr.ua!</h1>
    <p>Socket: ${process.env.PORT}</p>
    <p>Node: ${process.version}</p>
  `);
});

server.listen(process.env.PORT, () => {
  console.log("Server started on:", process.env.PORT);
});

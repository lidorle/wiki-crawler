const express = require("express");
const bodyParser = require("body-parser");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

const app = express();
const startWikiCrawling = require("./app");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/", async (req, res, next) => {
  const { link, level } = req.body;
  await startWikiCrawling(link, level);
  res.send();
});

if (cluster.isMaster) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(3000, () => {
    console.log(`server ${process.pid} @http://localhost:3000`);
  });
}

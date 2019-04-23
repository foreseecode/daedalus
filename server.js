const bodyParser = require("body-parser");
const chalk = require("chalk");
const express = require("express");
const MongoConnector = require("./lib/MongoConnector");

const PORT = 3005;
const app = express();
const mongoClient = new MongoConnector();

console.log("Server starting...");

// async
mongoClient.init();

// app.get("/", (req, res) => res.send("Hello World"));
app.use(express.static("web", { index: ["index.html", "index.htm"] }));

app.get("/toxicity", (req, res) =>
  res.sendFile("web/toxicity.html", { root: __dirname + "/web" })
);

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.options("/data", (req, res, next) => {
  // app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.sendStatus(200);
});

app.post("/data", async (req, res) => {
  try {
    const body = req.body.persona;
    const [satisfaction, rage, fidelity] = body.split("-");
    await mongoClient.insertDocuments([{ satisfaction, rage, fidelity }]);
    res.send({ satisfaction, rage, fidelity });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/personas", async (req, res) => {
  const data = await mongoClient.findDocuments();
  res.contentType("application/json");
  res.send(data);
});

app.listen(PORT);

console.log(`HTTP ready at ${chalk.bold.cyan(`http://localhost:${PORT}`)}`);

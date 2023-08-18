const express = require("express");
const app = express();
const apiRouter = require("./routes/api-routers");

app.use(express.json());

app.use("/api", apiRouter);

app.use((request, response) => {
  response.status(404).send({ message: "path does not exist" });
});

app.use((err, request, response, next) => {
  if (err.status) response.status(err.status).send({ message: err.msg });
  else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502")
    response.status(400).send({ message: "invalid request" });
  else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    if (err.detail.includes("Key (author)"))
      response.status(404).send({ message: "user does not exist" });
    if (err.detail.includes("Key (topic)"))
      response.status(404).send({ message: "topic does not exist" });
  } else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "server error" });
});

module.exports = app;

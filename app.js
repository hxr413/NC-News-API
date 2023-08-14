const express = require("express");
const app = express();
const { getDoc, getTopics } = require("./controllers/topics-controllers");

app.get("/api", getDoc);

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  if (err.status) response.status(err.status).send({ message: err.msg });
  else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "server error" });
});

module.exports = app;

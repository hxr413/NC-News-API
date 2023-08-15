const express = require("express");
const app = express();
const { getDoc, getTopics } = require("./controllers/topics-controllers");
const { getArticles, getArticleById } = require("./controllers/articles-controllers");
const { getCommentsById, postCommentById } = require("./controllers/comments-controllers");

app.get("/api", getDoc);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);

app.use((err, request, response, next) => {
  // console.log(err, "err in app");
  if (err.status) response.status(err.status).send({ message: err.msg });
  else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02")
    response.status(400).send({ message: "invalid request" });
  else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "server error" });
});

module.exports = app;

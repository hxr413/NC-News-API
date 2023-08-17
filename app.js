const express = require("express");
const app = express();
const { getDoc, getTopics } = require("./controllers/topics-controllers");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles-controllers");
const {
  getCommentsById,
  postCommentById,
  deleteCommentById,
  patchCommentById,
} = require("./controllers/comments-controllers");
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());

app.get("/api", getDoc);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);
app.patch("/api/comments/:comment_id", patchCommentById);

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
  if (err.code === "23503" && err.detail.includes("Key (author)"))
    response.status(404).send({ message: "user does not exist" });
  else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "server error" });
});

module.exports = app;

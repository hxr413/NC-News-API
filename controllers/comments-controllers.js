const {
  selectCommentsById,
  insertCommentById,
} = require("../models/comments-models");
const { checkExists } = require("../db/utils");

exports.getCommentsById = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [
    checkExists("articles", "article_id", article_id),
    selectCommentsById(article_id),
  ];

  Promise.all(promises)
    .then((resolved) => {
      const comments = resolved[1];
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentById = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;

  const promises = [
    checkExists("articles", "article_id", article_id),
    insertCommentById(comment.body, article_id, comment.username)
  ];

  Promise.all(promises)
    .then((resolved) => {
      const commentBody = resolved[1].body;
      response.status(201).send({ comment: commentBody });
    })
    .catch((err) => next(err));
};
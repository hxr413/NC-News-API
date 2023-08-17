const {
  selectCommentsById,
  insertCommentById,
  removeCommentById,
  updateCommentById,
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
    insertCommentById(comment.body, article_id, comment.username),
  ];

  Promise.all(promises)
    .then((resolved) => {
      const commentBody = resolved[1].body;
      response.status(201).send({ comment: commentBody });
    })
    .catch((err) => next(err));
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => next(err));
};

exports.patchCommentById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { comment_id } = request.params;

  updateCommentById(inc_votes, comment_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

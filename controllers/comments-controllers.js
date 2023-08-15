const { selectCommentById, insertCommentById } = require("../models/comments-models");

exports.getCommentsById = (request, response, next) => {
  const { article_id } = request.params;

  selectCommentById(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentById = (request, response, next) => {
  const { article_id } = request.params;

  insertCommentById(article_id)
    .then(({ body }) => {
      response.status(201).send({ comment: body });
    })
    .catch((err) => next(err));
};

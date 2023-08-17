const {
  selectCommentsById,
  insertCommentById,
  removeCommentById,
  updateCommentById,
} = require("../models/comments-models");
const { checkExists } = require("../db/utils");

exports.getCommentsById = (request, response, next) => {
  const { article_id } = request.params;

  const reqLimit = request.query.limit;
  const reqPage = request.query.p;

  if (reqLimit && (isNaN(parseInt(reqLimit)) || reqLimit <= 0)) {
    response.status(400).send({ message: "invalid query of limit" });
  }

  if (reqPage && (isNaN(parseInt(reqPage)) || reqPage <= 0)) {
    response.status(400).send({ message: "invalid query of page" });
  }

  const limit = parseInt(reqLimit) || 10;
  const page = parseInt(reqPage) || 1;
  const offset = (page - 1) * limit;

  const promises = [
    checkExists("articles", "article_id", article_id),
    selectCommentsById(article_id),
  ];

  Promise.all(promises)
    .then((resolved) => {
      const allComments = resolved[1];
      if (reqLimit || reqPage) {
        const paginatedComments = allComments.slice(offset, offset + limit);
        response.status(200).send({ comments: paginatedComments });
      } else response.status(200).send({ comments: allComments });
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

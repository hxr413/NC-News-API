const { selectCommentsById, insertCommentById } = require("../models/comments-models");
const { checkExists } = require("../db/utils");

exports.getCommentsById = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [
    checkExists("articles", "article_id", article_id),
    selectCommentsById(article_id)
  ];

  Promise.all(promises)
    .then((resolved) => {
      const comments = resolved[1];
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentById = () => {
  insertCommentById()
}

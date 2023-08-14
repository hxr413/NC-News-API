const { selectCommentById } = require("../models/comments-models");

exports.getCommentsById = (request, response, next) => {
  const { article_id } = request.params;
  
  selectCommentById(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

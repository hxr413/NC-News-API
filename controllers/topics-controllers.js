const { selectTopics, selectArticleById } = require("../models/topics-models");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (request, response, next) => {
  const { id } = request.params;
  selectArticleById(id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

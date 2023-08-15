const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles-models");

exports.getArticles = (request, response, next) => {
  const sort = request.query.sort_by || "created_at";
  const order = request.query.order || "desc";
  const topic = request.query.topic;

  selectArticles(sort, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;

  updateArticleById(inc_votes, article_id)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => next(err));
};

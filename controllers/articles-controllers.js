const {
  selectArticles,
  selectArticleById,
} = require("../models/articles-models");

exports.getArticles = (request, response, next) => {
  const sort = "created_at ";
  const order = "desc";

  selectArticles(sort, order)
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

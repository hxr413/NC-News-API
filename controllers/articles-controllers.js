const {
  selectArticles,
  insertArticle,
  selectArticleById,
  updateArticleById,
} = require("../models/articles-models");
const { checkExists } = require("../db/utils");

exports.getArticles = (request, response, next) => {
  const sort = request.query.sort_by || "created_at";
  const order = request.query.order || "desc";
  const topic = request.query.topic;

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

  const promises = [];
  let num = 0;
  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
    num = 1;
  }
  promises.push(selectArticles(sort, order, topic));

  Promise.all(promises)
    .then((resolved) => {
      const allArticles = resolved[num];
      const paginatedArticles = allArticles.slice(offset, offset + limit);
      response
        .status(200)
        .send({ articles: paginatedArticles, total_count: allArticles.length });
    })
    .catch((err) => next(err));
};

exports.postArticle = (request, response, next) => {
  const article = request.body;

  insertArticle(article)
    .then((article) => {
      response.status(201).send({ article });
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

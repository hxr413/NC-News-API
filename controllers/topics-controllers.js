const { selectTopics } = require("../models/topics-models");

exports.getTopics = (request, response, next) => {
  const order = request.query.order || "asc";
  const sort = request.query.sort_by || "slug";
  const slug = request.query.slug;

  selectTopics(order, sort, slug)
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

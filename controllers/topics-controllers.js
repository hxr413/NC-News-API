const { readDoc, selectTopics } = require("../models/topics-models");

exports.getDoc = (request, response, next) => {
  readDoc()
    .then((doc) => {
      response.status(200).send({ doc });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

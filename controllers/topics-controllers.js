const { selectTopics, insertTopic } = require("../models/topics-models");

exports.getDoc = (request, response, next) => {
  const doc = require(`${__dirname}/../endpoints.json`);
  response.status(200).send({ doc });
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.postTopic = (request, response, next) => {
  insertTopic;
};

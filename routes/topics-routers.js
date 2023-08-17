const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics-controllers");

// /api/topics
topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;

const apiRouter = require("express").Router();
const topicsRouter = require("./topics-routers");
const usersRouter = require("./users-routers");
const commentsRouter = require("./comments-routers");
const articlesRouter = require("./articles-routers");
const { getDoc } = require("../controllers/topics-controllers");

apiRouter.get("/", getDoc);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;

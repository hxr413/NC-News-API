const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments-controllers");

// /api/comments/:comment_id
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;

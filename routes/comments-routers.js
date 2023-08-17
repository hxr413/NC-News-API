const commentsRouter = require("express").Router();
const { deleteCommentById,patchCommentById } = require("../controllers/comments-controllers");

// /api/comments/:comment_id
commentsRouter.route("/:comment_id").delete(deleteCommentById).patch(patchCommentById)

module.exports = commentsRouter;

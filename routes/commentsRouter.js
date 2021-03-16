const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  delCommentById,
} = require("../controllers/commentsController");
const { handle404 } = require("../errors/index");

commentsRouter.patch("/:comment_id", patchCommentsById);
commentsRouter.delete("/:comment_id", delCommentById);

module.exports = commentsRouter;

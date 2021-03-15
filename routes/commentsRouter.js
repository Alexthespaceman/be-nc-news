const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  delCommentById,
} = require("../controllers/commentsController");

commentsRouter.patch("/:comment_id", patchCommentsById);
commentsRouter.delete("/:comment_id", delCommentById);
module.exports = commentsRouter;

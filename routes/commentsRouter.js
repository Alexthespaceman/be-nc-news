const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  delCommentById,
} = require("../controllers/commentsController");
const { handle405 } = require("../errors/index");

commentsRouter.route("/:comment_id").patch(patchCommentsById);

commentsRouter.route("/:comment_id").delete(delCommentById).all(handle405);

module.exports = commentsRouter;

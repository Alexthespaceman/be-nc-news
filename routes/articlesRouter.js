const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticlesById,
  getCommentsByArticleId,
} = require("../controllers/articleController");
const { postCommentByArticleID } = require("../controllers/commentsController");
const { handle405 } = require("../errors/index");

articlesRouter.patch("/:article_id", patchArticlesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.route("/").get(getArticles).all(handle405);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleID)
  .all(handle405);

articlesRouter.route("/:article_id").get(getArticleById).all(handle405);

module.exports = articlesRouter;

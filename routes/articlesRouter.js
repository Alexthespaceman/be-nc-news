const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
} = require("../controllers/articleController");
const { patchArticlesById } = require("../controllers/articleController");
const { postCommentByArticleID } = require("../controllers/commentsController");
const { getCommentsByArticleId } = require("../controllers/articleController");
const { handle405 } = require("../errors/index");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticlesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.route("/").get(getArticles).all(handle405);
module.exports = articlesRouter;

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleID)
  .all(handle405);

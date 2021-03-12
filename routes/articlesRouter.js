const articlesRouter = require("express").Router();
const {
  getArticleById,
  getCommentsByCreatedAt,
} = require("../controllers/articleController");
const { patchArticlesById } = require("../controllers/articleController");
const { postCommentByArticleID } = require("../controllers/commentsController");
const { getCommentsByArticleId } = require("../controllers/articleController");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticlesById);
articlesRouter.post("/:article_id/comments", postCommentByArticleID);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

module.exports = articlesRouter;

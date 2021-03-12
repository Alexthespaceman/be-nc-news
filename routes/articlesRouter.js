const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articleController");
const { patchArticlesById } = require("../controllers/articleController");
const { postCommentByArticleID } = require("../controllers/commentsController");
const { commentsRouter } = require("./commentsRouter");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticlesById);
articlesRouter.post("/:article_id/comments", postCommentByArticleID);

module.exports = articlesRouter;

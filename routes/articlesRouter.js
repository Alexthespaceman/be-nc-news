const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articleController");
const { patchArticlesById } = require("../controllers/articleController");
const { handle404 } = require("../errors/index");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.route("/:article_id/").patch(patchArticlesById);

module.exports = articlesRouter;

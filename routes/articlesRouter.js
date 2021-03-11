const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articleController");

articlesRouter.get("/:article_id", getArticleById);

module.exports = articlesRouter;

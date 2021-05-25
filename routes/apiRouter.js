const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { handle405 } = require("../errors");
const { getJSON } = require("../controllers/JSONcontroller");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route("/").get(getJSON).all(handle405);

module.exports = apiRouter;

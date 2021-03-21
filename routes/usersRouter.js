const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getUsers,
} = require("../controllers/usersController");
const { handle405 } = require("../errors");

usersRouter.route("/:username").get(getUserByUsername).all(handle405);
usersRouter.route("/").get(getUsers).all(handle405);

module.exports = usersRouter;

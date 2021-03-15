const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getUsers,
} = require("../controllers/usersController");
const { handle405 } = require("../errors");

usersRouter.get("/:username", getUserByUsername);
usersRouter.route("/").get(getUsers).all(handle405);

module.exports = usersRouter;

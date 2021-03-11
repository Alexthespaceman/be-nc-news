const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/userNameController");
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;

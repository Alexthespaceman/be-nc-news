const { fetchUserByUsername } = require("../models/usersModels");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

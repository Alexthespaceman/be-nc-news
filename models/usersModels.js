const dbConnection = require("../db/dbConnection");

exports.fetchUserByUsername = (username) => {
  return dbConnection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then((users) => {
      if (!users.length)
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      else return users[0];
    });
};

exports.fetchUsers = () => {
  return dbConnection.select("*").from("users");
};

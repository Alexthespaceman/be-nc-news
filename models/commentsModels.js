const dbConnection = require("../db/dbConnection");

exports.updateCommentsByCommentId = (inc_votes, comment_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    return dbConnection("comments")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_votes)
      .returning("*");
  }
};

exports.removeCommentById = (comment_id) => {
  return dbConnection("comments")
    .where("comments.comment_id", "=", comment_id)
    .del();
};

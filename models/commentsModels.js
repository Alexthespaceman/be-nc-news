const dbConnection = require("../db/dbConnection");

exports.updateCommentsByCommentId = (inc_votes, comment_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  if (comment_id > 200) {
    return Promise.reject({ status: 400, msg: "End point not found" });
  } else {
    return dbConnection("comments")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_votes)
      .returning("*");
  }
};

exports.removeCommentById = (comment_id) => {
  if (comment_id > 200) {
    return Promise.reject({ status: 404, msg: "End point not found" });
  } else {
    return dbConnection("comments")
      .where("comments.comment_id", "=", comment_id)
      .del();
  }
};

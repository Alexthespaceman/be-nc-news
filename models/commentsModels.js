const dbConnection = require("../db/dbConnection");

exports.updateCommentsByCommentId = (inc_votes, comment_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return dbConnection("comments")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then((comment) => {
        if (comment.length === 0) {
          return Promise.reject({ status: 400, msg: "End point not found" });
        } else {
          return comment;
        }
      });
  }
};

exports.removeCommentById = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Comment id is not a number" });
  }
  return dbConnection("comments")
    .where("comments.comment_id", "=", comment_id)
    .del()
    .then((comment) => {
      if (!comment) {
        return Promise.reject({ status: 400, msg: "End point not found" });
      } else {
        return comment;
      }
    });
};

const dbConnection = require("../db/dbConnection");

exports.updateCommentsByCommentId = (updatedVotes, comment_id) => {
  return dbConnection("comments")
    .where("comments.comment_id", "=", comment_id)
    .increment("votes", updatedVotes.inc_votes)
    .returning("*");
};

exports.removeCommentById = (comment_id) => {
  return dbConnection("comments")
    .where("comments.comment_id", "=", comment_id)
    .del();
};

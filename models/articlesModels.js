const dbConnection = require("../db/dbConnection");

exports.fetchArticleById = (article_id) => {
  return dbConnection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .then((article) => article[0]);
};

exports.updateVotesById = (updatedVotes, article_id) => {
  return dbConnection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", updatedVotes.inc_votes)
    .returning("*");
};

// line 19 is an agggrgate function

exports.updateCommentsByArticleId = (updatedComments, article_id) => {
  return dbConnection
    .insert(updatedComments, "body")
    .into("comments")
    .where("article_id", "=", article_id)
    .returning("*");
};

exports.fetchCommentsByArticleId = (article_id) => {
  return dbConnection
    .select("*")
    .from("comments")
    .orderBy("created_at", "desc")
    .where("comments.article_id", "=", article_id)
    .then((comments) => comments);
};

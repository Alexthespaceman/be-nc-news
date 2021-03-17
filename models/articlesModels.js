const dbConnection = require("../db/dbConnection");

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return dbConnection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .then((article) => article[0]);
};

exports.updateVotesById = (inc_votes, article_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return dbConnection("articles")
      .where("article_id", "=", article_id)
      .increment("votes", inc_votes)
      .returning("*");
  }
};

exports.updateCommentsByArticleId = (body, userName, article_id) => {
  if (article_id > 200) {
    return Promise.reject({ status: 404, msg: "End point not found" });
  }
  if (isNaN(article_id) || !userName || !body) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return dbConnection("comments")
      .insert([{ author: userName, body: body }])
      .into("comments")
      .where("article_id", "=", article_id)
      .returning("*");
  }
};

exports.fetchCommentsByArticleId = (article_id, sort_by) => {
  return dbConnection
    .select("*")
    .from("comments")
    .orderBy(sort_by || "created_at", "desc")
    .where("article_id", "=", article_id)
    .returning("*");
};

exports.fetchAllArticles = (query) => {
  const sort_by = query.sort_by;
  const order = query.order;
  const author = query.author;
  const topic = query.topic;
  return dbConnection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id", { as: "comment_count" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .modify((querySoFar) => {
      if (author !== undefined) {
        querySoFar.where("articles.author", author);
      }
      if (topic !== undefined) {
        querySoFar.where("topic", topic);
      }
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .then((dbRes) => {
      return dbRes;
    });
};

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
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      } else {
        return article;
      }
    });
};

exports.updateVotesById = (inc_votes, article_id, articleBody) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  if (Object.keys(articleBody).length > 1) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return dbConnection("articles")
      .where("article_id", "=", article_id)
      .increment("votes", inc_votes)
      .returning("*");
  }
};

exports.updateCommentsByArticleId = (body, userName, article_id) => {
  console.log(userName);
  if (!article_id) {
    return Promise.reject({ status: 404, msg: "End point not found" });
  }

  if (isNaN(article_id) || !userName || !body) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return (
      dbConnection("comments")
        .insert([{ author: userName, body: body, article_id: article_id }])
        .into("comments")
        // .where("articles.article_id", "=", article_id)
        .returning("*")
    );
  }
};

exports.fetchCommentsByArticleId = (article_id, sort_by, order) => {
  if (
    sort_by === undefined ||
    sort_by === "votes" ||
    sort_by === "author" ||
    sort_by === "topics"
  ) {
    return dbConnection
      .select("*")
      .from("comments")
      .orderBy(sort_by || "created_at", order || "desc")
      .where("article_id", "=", article_id)
      .returning("*")
      .then((comment) => {
        if (comment.length === 0) {
          return Promise.reject({ status: 400, msg: "End point not found" });
        } else {
          return comment;
        }
      });
  }
  return Promise.reject({ status: 404, msg: "Invalid request" });
};

exports.doesUsersExsist = ({ author }) => {
  if (author) {
    return dbConnection
      .select("*")
      .from("users")
      .where("username", author)
      .then((username) => {
        if (!username.length) {
          return Promise.reject({
            status: 400,
            msg: "Username does not exist",
          });
        }
      });
  }
};

exports.doesTopicExsist = ({ topic }) => {
  if (topic) {
    return dbConnection
      .select("*")
      .from("topics")
      .where("slug", topic)
      .then((topics) => {
        if (!topics.length) {
          return Promise.reject({
            status: 400,
            msg: "Current topic does not exist",
          });
        }
      });
  }
};

exports.fetchAllArticles = (query) => {
  const sort_by = query.sort_by;
  const order = query.order;
  const author = query.author;
  const topic = query.topic;

  if (
    sort_by === undefined ||
    sort_by === "votes" ||
    sort_by === "author" ||
    sort_by === "topic"
  ) {
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
  }
  return Promise.reject({ status: 400, msg: "Invalid request" });
};

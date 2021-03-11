const dbConnection = require("../db/dbConnection");

exports.fetchArticleById = (article_id) => {
  return dbConnection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then((article) => article[0]);
};

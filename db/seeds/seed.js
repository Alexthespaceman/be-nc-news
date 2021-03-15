const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const {
  changeTimeStamp,
  createReferenceObject,
  switchKeyReference,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData).into("topics").returning("*");
    })
    .then(() => {
      return knex.insert(userData).into("users").returning("*");
    })
    .then(() => {
      const formattedArticles = changeTimeStamp(articleData, "created_at");
      return knex.insert(formattedArticles).into("articles").returning("*");
    })
    .then((insertedArticles) => {
      const articleRef = createReferenceObject(
        insertedArticles,
        "title",
        "article_id"
      );
      const userRef = createReferenceObject(
        commentData,
        "created_by",
        "created_by"
      );
      let formattedComments = switchKeyReference(
        commentData,
        articleRef,
        "belongs_to",
        "article_id"
      );
      formattedComments = switchKeyReference(
        formattedComments,
        userRef,
        "created_by",
        "author"
      );
      formattedComments = changeTimeStamp(formattedComments, "created_at");
      return knex.insert(formattedComments).into("comments").returning("*");
    });
};

const {
  updateVotesById,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  doesUsersExsist,
  doesTopicExsist,
} = require("../models/articlesModels");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const articleBody = req.body;
  updateVotesById(inc_votes, article_id, articleBody)
    .then((articles) => {
      res.status(200).send({ articles: articles[0] });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;

  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  Promise.all([
    fetchAllArticles(query),
    doesUsersExsist(query),
    doesTopicExsist(query),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles: { articles } });
    })
    .catch(next);
};

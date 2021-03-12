const { updateCommentsByArticleId } = require("../models/articlesModels");

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const updatedComments = req.body;

  updateCommentsByArticleId(updatedComments, article_id)
    .then((data) => {
      res.status(201).send({ article: data[0] });
    })
    .catch((err) => {
      next(err);
    });
};

const { updateCommentsByArticleId } = require("../models/articlesModels");
const {
  updateCommentsByCommentId,
  removeCommentById,
} = require("../models/commentsModels");

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req.body;
  const { userName } = req.body;
  const bodyObject = req.body;
  updateCommentsByArticleId(body, userName, article_id, bodyObject)
    .then((comments) => {
      res.status(201).send({ article: comments[0] });
    })
    .catch(next);
};

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentsByCommentId(inc_votes, comment_id)
    .then((comments) => {
      res.status(200).send({ comment: comments[0] });
    })
    .catch(next);
};

exports.delCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((comments) => {
      res.status(204).send({ comment: comments[0] });
    })
    .catch(next);
};

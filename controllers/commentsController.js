const { updateCommentsByArticleId } = require("../models/articlesModels");
const { updateCommentsByCommentId } = require("../models/commentsModels");
const { removeCommentById } = require("../models/commentsModels");

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const commentBody = req.body.body;
  const commentUsername = req.body.userName;
  updateCommentsByArticleId(commentBody, commentUsername, article_id)
    .then((comments) => {
      res.status(201).send({ article: comments[0] });
    })
    .catch(next);
};

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedVotes = req.body;
  updateCommentsByCommentId(updatedVotes, comment_id)
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

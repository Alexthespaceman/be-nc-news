const { fetchArticleById } = require("../models/articlesModels");
const { updateVotesById } = require("../models/articlesModels");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const updatedVotes = req.body;
  updateVotesById(updatedVotes, article_id)
    .then((data) => {
      res.status(200).send({ article: data[0] });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.addNewCat = (req, res) => {
//   const newCat = req.body;
//   writeCat(newCat, (err, insertedCat) => {
//     if (err) console.log(err);
//     else res.status(201).send({ cat: insertedCat });
//   });
// };

const { fetchTopicsJSON } = require("../models/endpointsModel");

console.log("in here");

exports.getTopicsJSON = (req, res, next) => {
  fetchTopicsJSON()
    .then((endPoints) => {
      res.status(200).send({ endPoints });
    })
    .catch(next);
};

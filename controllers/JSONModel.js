const { fetchTopicsJSON } = require("../models/endpointsModel");

exports.getTopicsJSON = (req, res, next) => {
  fetchTopicsJSON()
    .then((endPoints) => {
      res.status(200).send({ api: endPoints });
    })
    .catch(next);
};

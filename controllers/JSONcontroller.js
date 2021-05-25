const { fetchJSON } = require("../models/endpointsModel");

exports.getJSON = (req, res, next) => {
  fetchJSON()
    .then((endPoints) => {
      return res.status(200).send(endPoints);
    })
    .catch(next);
};

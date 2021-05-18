const { fetchJSON } = require("../models/endpointsModel");

console.log("in here");

exports.getJSON = (req, res, next) => {
  fetchJSON()
    .then((endPoints) => {
      return res.status(200).send(endPoints);
    })
    .catch(next);
};

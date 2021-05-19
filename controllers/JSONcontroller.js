const { fetchJSON } = require("../models/endpointsModel");

exports.getJSON = (req, res, next) => {
  console.log("in controller");
  fetchJSON()
    .then((endPoints) => {
      return res.status(200).send(endPoints);
    })
    .catch(next);
};

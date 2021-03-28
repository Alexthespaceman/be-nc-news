const fetchApi = require("../models/apiModel");

exports.getApi = () => {
  fetchApi()
    .then((api) => {
      res.status(200).send({ api: api });
    })
    .catch(next);
};

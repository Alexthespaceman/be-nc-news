exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handle404 = (err, req, res, next) => {
  console.log(err);
  res.status(404).send({ msg: "Article_id not found" });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
};

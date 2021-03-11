exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
};

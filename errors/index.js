exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

// exports.handle500s = (err, req, res, next) => {
//   console.log(err);
//   res.status(500).send({ msg: "Server error" });
// };

exports.handle400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
  } else next(err);
};

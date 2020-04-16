const handlePSQLErrors = (err, req, res, next) => {
  const codes = {
    //"42703": { status: 400, msg: "Column not found" },
    "22P02": { status: 400, msg: "Bad Request" },
    "23503": { status: 404, msg: "article_id or username not found" },
    "23502": { status: 400, msg: "comment field cannot be empty" },
  };
  if (err.code in codes) {
    const { status, msg } = codes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

const handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

const handle500s = (err, req, res, next) => {
  //console.log(err);
  res.status(500).send({ msg: "You have encountered a Server Error" });
};
module.exports = {
  handlePSQLErrors,
  handleCustomErrors,
  handleInvalidPaths,
  handle500s,
};

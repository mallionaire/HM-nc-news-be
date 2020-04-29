const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInvalidPaths,
  handle500s,
} = require("./errors");


app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidPaths);


app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;

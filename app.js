const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");

//require in routes
//require in error handling middleware

//remember to use body parser

app.use("/api", apiRouter);

//Error handling middleware

module.exports = app;

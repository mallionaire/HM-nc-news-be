const express = require("express");
const apiRouter = express.Router();
const topicRouter = require("./topicRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const articlesRouter = require("./articlesRouter");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;

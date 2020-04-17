const express = require("express");
const apiRouter = express.Router();
const topicRouter = require("./topicRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const articlesRouter = require("./articlesRouter");
const { handle405s } = require("../errors");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.route("/").all(handle405s);

module.exports = apiRouter;

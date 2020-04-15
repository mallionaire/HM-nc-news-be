const express = require("express");
const topicRouter = express.Router();
const { getTopics } = require("../controllers/topicsControllers");

topicRouter.route("/").get(getTopics);

module.exports = topicRouter;

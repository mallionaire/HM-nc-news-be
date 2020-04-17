const express = require("express");
const topicRouter = express.Router();
const { getTopics } = require("../controllers/topicsControllers");
const { handle405s } = require("../errors");

topicRouter.route("/").get(getTopics).all(handle405s);

module.exports = topicRouter;

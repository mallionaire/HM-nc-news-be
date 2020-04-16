const express = require("express");
const articlesRouter = express.Router();
const {
  getArticle,
  patchVotes,
  getComments,
  postComment,
} = require("../controllers/articlesControllers");

//may need to make a route for "/" ??

articlesRouter.route("/:article_id").get(getArticle).patch(patchVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;

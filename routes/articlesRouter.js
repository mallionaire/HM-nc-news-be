const express = require("express");
const articlesRouter = express.Router();
const {
  getArticle,
  patchVotes,
  getComments,
  postComment,
  getAllArticles,
} = require("../controllers/articlesControllers");
const { handle405s } = require("../errors");

articlesRouter.route("/").get(getAllArticles).all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchVotes)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(handle405s);

module.exports = articlesRouter;

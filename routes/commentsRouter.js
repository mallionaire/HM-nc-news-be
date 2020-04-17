const express = require("express");
const commentsRouter = express.Router();
const {
  changeCommentVotes,
  deleteComment,
} = require("../controllers/commentsControllers");
//const { handle405s } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(changeCommentVotes)
  .delete(deleteComment);
//.all(handle405s);

module.exports = commentsRouter;

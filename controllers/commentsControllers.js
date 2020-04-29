const {
  updateCommentVotes,
  removeComment,
} = require("../models/commentsModels");

const changeCommentVotes = (req, res, next) => {
  updateCommentVotes(req.params, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  removeComment(req.params)
    .then((commentDeleted) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { changeCommentVotes, deleteComment };

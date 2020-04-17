const {
  updateCommentVotes,
  removeComment,
} = require("../models/commentsModels");

const changeCommentVotes = (req, res, next) => {
  //console.log("Nobody even reads the comments");
  updateCommentVotes(req.params, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  //console.log("Well you're not gonna read it now...");
  removeComment(req.params)
    .then((commentDeleted) => {
      //console.log(commentDeleted);
      if (commentDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "Could not delete, comment not found",
        });
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

module.exports = { changeCommentVotes, deleteComment };

const connection = require("../db/connection");

const updateCommentVotes = ({ comment_id }, { inc_vote }) => {
  //console.log(comment_id, inc_vote);
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_vote)
    .returning("*")
    .then((updatedComment) => {
      if (!updatedComment.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      //console.log("Use your vote, in models", updatedComment);
      return updatedComment[0];
    });
};

const removeComment = ({ comment_id }) => {
  //console.log("Delete your comment, in models");
  return connection("comments").where("comment_id", comment_id).del();
  // .then((DeletedComment) => {
  //   if (!DeletedComment.length)
  //     return Promise.reject({
  //       status: 404,
  //       msg: "Could not delete, comment not found",
  //     });
  // });
};

module.exports = { updateCommentVotes, removeComment };

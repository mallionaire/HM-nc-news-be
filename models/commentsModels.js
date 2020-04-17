const connection = require("../db/connection");

const updateCommentVotes = ({ comment_id }, { inc_votes }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then((updatedComment) => {
      if (!updatedComment.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }

      return updatedComment[0];
    });
};

const removeComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then((commentDeleted) => {
      if (commentDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "Could not delete, comment not found",
        });
      }
    });
};

module.exports = { updateCommentVotes, removeComment };

const connection = require("../db/connection");

const fetchArticle = ({ article_id }) => {
  //console.log("in Articles models");
  return connection("articles")
    .select("articles.*")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .then((articles) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      //console.log(articles);
      return articles[0];
    });
};

const updateVotes = ({ article_id }, { inc_votes }) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((updatedArticle) => {
      return updatedArticle[0];
    });
};

const addComment = ({ body, username }, { article_id }) => {
  //console.log(comment);

  return connection("comments")
    .insert({ body, author: username, article_id })
    .returning("*")
    .then((comment) => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Nope not found" });
      }
      //console.log(comment);
      return comment[0];
    });
};

const fetchCommentsByArticleId = ({ article_id }) => {
  //console.log("Wanna fetch some comments?");
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: "No comments could be found",
        });
      }
      //console.log(comment);
      return comments;
    });
};

// 'comment_id', 'votes', 'created_at', 'author', 'body'
module.exports = {
  fetchArticle,
  updateVotes,
  addComment,
  fetchCommentsByArticleId,
};

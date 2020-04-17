const connection = require("../db/connection");

const fetchArticle = ({ article_id }) => {
  //console.log("in Articles models", article_id);
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
    .increment("votes", inc_votes || 0)
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

const fetchCommentsByArticleId = ({ article_id }, { sort_by, order }) => {
  //console.log("Wanna fetch some comments?");
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: "No comments could be found for that article",
        });
      }
      return comments;
    });
};

const fetchAllArticles = ({ sort_by, order, author, topic }) => {
  //console.log("ALL the articles you say??");
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.votes",
      "articles.created_at"
    )
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify((query) => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then((articles) => {
      if (!articles.length && author) {
        return Promise.reject({
          status: 404,
          msg: "That author could not be found",
        });
      } else if (!articles.length && topic) {
        return Promise.reject({
          status: 404,
          msg: "That topic could not be found",
        });
      } else {
        //console.log(articles);
        return articles;
      }
    });
};

// 'comment_id', 'votes', 'created_at', 'author', 'body'
module.exports = {
  fetchArticle,
  updateVotes,
  addComment,
  fetchCommentsByArticleId,
  fetchAllArticles,
};

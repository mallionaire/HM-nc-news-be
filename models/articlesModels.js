const connection = require("../db/connection");

const fetchArticle = ({ article_id }) => {
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
  return connection("comments")
    .insert({ body, author: username, article_id })
    .returning("*")
    .then((comment) => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Nope not found" });
      }

      return comment[0];
    });
};

const fetchCommentsByArticleId = ({ article_id }, { sort_by, order }) => {
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc");
};

const checkArticleExists = ({ article_id }) => {
  return connection("articles")
    .select()
    .where("article_id", article_id)
    .then((articles) => {
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: "No comments could be found for that article",
        });
      }
    });
};

const fetchAllArticles = ({ sort_by, order, author, topic }) => {
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
    });
};

const validateTopics = ({ topic }) => {
  return connection("topics")
    .select("*")
    .where("slug", topic)
    .then((validTopic) => {
      if (!validTopic.length) {
        return Promise.reject({
          status: 404,
          msg: "That topic could not be found",
        });
      }
      return validTopic[0];
    });
};

const validateAuthor = ({ author }) => {
  return connection("users")
    .select("*")
    .where("username", author)
    .then((validAuthor) => {
      if (!validAuthor.length) {
        return Promise.reject({
          status: 404,
          msg: "That author could not be found",
        });
      }
      return validAuthor[0];
    });
};

module.exports = {
  fetchArticle,
  updateVotes,
  addComment,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  validateTopics,
  validateAuthor,
};

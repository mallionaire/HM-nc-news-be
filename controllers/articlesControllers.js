const {
  fetchArticle,
  updateVotes,
  addComment,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  validateTopics,
  validateAuthor,
} = require("../models/articlesModels");

const getArticle = (req, res, next) => {
  //console.log("in Articles Controller", req.params);
  fetchArticle(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

const patchVotes = (req, res, next) => {
  //console.log(req.params, req.body);
  updateVotes(req.params, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

const postComment = (req, res, next) => {
  //console.log(req.body, req.params);
  addComment(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

const getComments = (req, res, next) => {
  Promise.all([
    fetchCommentsByArticleId(req.params, req.query),
    checkArticleExists(req.params),
  ])
    .then(([comments]) => {
      // console.log(comments);
      res.status(200).send({ comments });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

const getAllArticles = (req, res, next) => {
  const { topic, author } = req.query;
  if (topic) {
    validateTopics(req.query).catch(next);
  }
  if (author) {
    validateAuthor(req.query).catch(next);
  }

  fetchAllArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};
//
module.exports = {
  getArticle,
  patchVotes,
  postComment,
  getComments,
  getAllArticles,
};

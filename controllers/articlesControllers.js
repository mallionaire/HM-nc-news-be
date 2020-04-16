const {
  fetchArticle,
  updateVotes,
  addComment,
  fetchCommentsByArticleId,
} = require("../models/articlesModels");

const getArticle = (req, res, next) => {
  //console.log("in Articles Controller");
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
  fetchCommentsByArticleId(req.params, req.query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};
module.exports = { getArticle, patchVotes, postComment, getComments };

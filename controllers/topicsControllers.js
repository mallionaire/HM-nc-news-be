const { fetchTopics } = require("../models/topicsModels");

const getTopics = (req, res, next) => {
  //console.log("in topics Controller, come and GET yer topics");
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

module.exports = {
  getTopics,
};

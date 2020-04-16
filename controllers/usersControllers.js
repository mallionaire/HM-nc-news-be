const { fetchUser } = require("../models/usersModels");

const getUser = (req, res, next) => {
  //console.log("in Users Controller");
  fetchUser(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

module.exports = { getUser };

const connection = require("../db/connection");

const fetchUser = ({ username }) => {
  //console.log("in users models");
  return connection("users")
    .where("username", username)
    .select("*")
    .then((singleUser) => {
      if (!singleUser.length) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return singleUser[0];
    });
};

module.exports = { fetchUser };

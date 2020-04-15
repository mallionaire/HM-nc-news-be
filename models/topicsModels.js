//connection
const connection = require("../db/connection");

const fetchTopics = () => {
  //console.log("in topics Models. Do they even still sell Topics?");
  return connection.select("*").from("topics");
};

module.exports = { fetchTopics };

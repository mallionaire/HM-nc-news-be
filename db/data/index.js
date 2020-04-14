const ENV = process.env.NODE_ENV || "development";

const data = {
  test: require("./test-data"),
  development: require("./test-data"),
};

module.exports = data[ENV];

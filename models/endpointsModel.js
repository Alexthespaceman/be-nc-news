const fs = require("fs").promises;

exports.fetchTopicsJSON = () => {
  return fs.readFile("endpoints.JSON", "utf8").then((endPoints) => {
    return JSON.parse(endPoints);
  });
};

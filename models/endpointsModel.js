const fs = require("fs").promises;

exports.fetchJSON = () => {
  return fs.readFile("endpoints.JSON", "utf8").then((endPoints) => {
    return JSON.parse(endPoints);
  });
};

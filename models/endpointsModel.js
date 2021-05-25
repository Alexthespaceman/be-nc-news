const fs = require("fs").promises;

exports.fetchJSON = () => {
  return fs.readFile("endpoints.json", "utf8").then((endPoints) => {
    return JSON.parse(endPoints);
  });
};

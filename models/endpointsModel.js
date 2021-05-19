const fs = require("fs").promises;

exports.fetchJSON = () => {
  console.log("in model");
  return fs.readFile("endpoints.json", "utf8").then((endPoints) => {
    return JSON.parse(endPoints);
  });
};

const format = require("pg-format");
const fs = require("node:fs/promises");
const db = require("../db/connection");

exports.readDoc = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    return JSON.parse(data);
  });
};

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    const rows = result.rows;
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topic with this slug" });
    }
    return rows;
  });
};

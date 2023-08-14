const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    const rows = result.rows;
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topic with this slug" });
    }
    return rows;
  });
};

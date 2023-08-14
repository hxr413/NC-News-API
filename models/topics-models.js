const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    const output = result.rows;
    if (output.length === 0) {
      return Promise.reject({ status: 404, msg: "no topic found" });
    }
    return output;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      const output = result.rows[0];
      if (!output) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return output;
    });
};

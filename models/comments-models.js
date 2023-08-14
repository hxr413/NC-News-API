const format = require("pg-format");
const db = require("../db/connection");

exports.selectCommentById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      const output = result.rows;
      if (!output[0]) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    })
    .then(() => {
      return db.query(`SELECT * FROM comments WHERE article_id = $1`, [id]);
    })
    .then((result) => {
      const output = result.rows;
      if (!output[0]) {
        return Promise.reject({ status: 404, msg: "article has no comments" });
      }
      return output;
    });
};

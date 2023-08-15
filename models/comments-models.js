const db = require("../db/connection");

exports.selectCommentsById = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then((result) => {
      const output = result.rows;
      if (!output[0]) {
        return Promise.reject({ status: 404, msg: "article has no comments" });
      }
      return output;
    });
};

exports.insertCommentById = (body, id, author) => {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author)
      VALUES ($1, $2, $3) RETURNING *`,
      [body, id, author]
    )
    .then((result) => {
      const output = result.rows;
      return output[0];
    });
};

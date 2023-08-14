const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticles = (sort, order) => {
  const selectQuery = `SELECT articles.article_id, title, topic, author, created_at, votes, article_img_url, COALESCE(comments.comment_count, 0) AS comment_count
  FROM articles LEFT JOIN (
    SELECT article_id, COUNT(*) AS comment_count 
    FROM comments GROUP BY article_id
    ) comments ON articles.article_id = comments.article_id
  ORDER BY ${sort} ${order};`;

  return db.query(selectQuery).then((result) => {
    const output = result.rows;
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

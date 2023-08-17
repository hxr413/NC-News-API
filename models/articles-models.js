const db = require("../db/connection");

exports.selectArticles = (sort, order, topic) => {
  const acceptedSort = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  if (!acceptedSort.includes(sort)) {
    return Promise.reject({ status: 400, msg: "invalid query of sort_by" });
  }

  const acceptedOrder = ["asc", "desc"];
  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query of order" });
  }

  const queryValues = [];
  let baseQuery = `SELECT articles.article_id, title, topic, author, created_at, votes, article_img_url, COALESCE(comments.comment_count::integer, 0) AS comment_count
  FROM articles LEFT JOIN (
    SELECT article_id, COUNT(*) AS comment_count 
    FROM comments GROUP BY article_id
    ) comments ON articles.article_id = comments.article_id `;

  if (topic) {
    baseQuery += "WHERE topic = $1 ";
    queryValues.push(topic);
  }

  baseQuery += `ORDER BY ${sort} ${order};`;

  return db.query(baseQuery, queryValues).then((result) => {
    const output = result.rows;
    if (!output[0]) {
      return Promise.reject({ status: 200, msg: "no article with this topic" });
    }
    return output;
  });
};

exports.insertArticle = async (article) => {
  const queryValues = [
    article.title,
    article.topic,
    article.author,
    article.body,
  ];

  for (const value of queryValues) {
    if (!value) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
  }

  let insertQuery = `INSERT INTO articles (title, topic, author, body)
  VALUES ($1, $2, $3, $4) RETURNING *`;

  if (article.article_img_url) {
    queryValues.push(article.article_img_url);
    insertQuery = `INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  }

  const { rows } = await db.query(insertQuery, queryValues);
  const postArticle = rows[0];
  postArticle.comment_count = 0;
  return postArticle;
};

exports.selectArticleById = (id) => {
  const selectQuery = `SELECT articles.article_id, title, topic, author, body, created_at, votes, article_img_url, COALESCE(comments.comment_count::integer, 0) AS comment_count
  FROM articles LEFT JOIN (
    SELECT article_id, COUNT(*) AS comment_count 
    FROM comments GROUP BY article_id
    ) comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1;`;

  return db.query(selectQuery, [id]).then((result) => {
    const output = result.rows[0];
    if (!output) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return output;
  });
};

exports.updateArticleById = (votesChange, id) => {
  if (!votesChange) {
    return Promise.reject({ status: 400, msg: "no inc_votes sent" });
  }

  const updateQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  const queryValues = [votesChange, id];

  return db.query(updateQuery, queryValues).then((result) => {
    const output = result.rows;
    if (!output[0]) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return output[0];
  });
};

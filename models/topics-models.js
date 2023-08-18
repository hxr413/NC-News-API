const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    const output = result.rows;
    return output;
  });
};

exports.insertTopic = (topic) => {
  const queryValues = [topic.slug, topic.description];
  for (const value of queryValues) {
    if (!value) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
  }

  let insertQuery = `INSERT INTO topics (slug, description)
  VALUES ($1, $2) RETURNING *`;

  return db.query(insertQuery, queryValues).then((result) => {
    const output = result.rows;
    return output[0];
  });
};

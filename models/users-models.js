const db = require("../db/connection");

exports.selectUsers = (sort, order) => {
  return db.query("SELECT * FROM users").then((result) => {
    const output = result.rows;
    return output;
  });
};

exports.selectUserByName = (username) => {
  const selectQuery = "SELECT * FROM users WHERE username = $1";

  return db.query(selectQuery, [username]).then((result) => {
    const output = result.rows[0];
    if (!output) {
      return Promise.reject({ status: 404, msg: "user does not exist" });
    }
    return output;
  });
};

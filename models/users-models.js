const db = require("../db/connection");

exports.selectUsers = (sort, order) => {
  return db.query("SELECT * FROM users").then((result) => {
    const output = result.rows;
    return output;
  });
};

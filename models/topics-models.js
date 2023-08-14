const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = (order, sort, slug) => {
  const acceptedOrder = ["asc", "desc"];
  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query of order" });
  }

  const acceptedSort = ["slug", "description"];
  if (!acceptedSort.includes(sort)) {
    return Promise.reject({ status: 400, msg: "invalid query of sort_by" });
  }

  const queryValues = [];
  let baseQuery = `SELECT * FROM topics `;

  if (slug) {
    baseQuery += "WHERE slug = $1 ";
    queryValues.push(slug);
  }

  baseQuery += `ORDER BY ${sort} ${order};`;

  return db.query(baseQuery, queryValues).then((result) => {
    const rows = result.rows;
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topic with this slug" });
    }
    return rows;
  });
};

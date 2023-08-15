const format = require("pg-format");
const db = require("./connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkExists = async (table, column, value) => {
  const selectQuery = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const result = await db.query(selectQuery, [value]);
  const output = result.rows;
  if (!output[0]) {
    return Promise.reject({
      status: 404,
      msg: `${table.slice(0, -1)} does not exist`,
    });
  }
  return output;
};

const { selectUsers, selectUserByName } = require("../models/users-models");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUserByName = (request, response, next) => {
  const { username } = request.params;

  selectUserByName(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => next(err));
};

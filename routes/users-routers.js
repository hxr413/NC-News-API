const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users-controllers");

// /api/users
usersRouter.get("/", getUsers);

module.exports = usersRouter;
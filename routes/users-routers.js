const usersRouter = require("express").Router();
const { getUsers, getUserByName } = require("../controllers/users-controllers");

// /api/users
usersRouter.get("/", getUsers);

// /api/users/:username
usersRouter.get("/:username", getUserByName);

module.exports = usersRouter;
const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers/usersControllers");

//may need to make a route for "/" ??

usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;

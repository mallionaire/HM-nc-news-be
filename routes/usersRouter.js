const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers/usersControllers");
const { handle405s } = require("../errors");

//may need to make a route for "/" ??

usersRouter.route("/:username").get(getUser).all(handle405s);

module.exports = usersRouter;

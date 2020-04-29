const express = require("express");
const usersRouter = express.Router();
const { getUser } = require("../controllers/usersControllers");
const { handle405s } = require("../errors");

usersRouter.route("/:username").get(getUser).all(handle405s);

module.exports = usersRouter;

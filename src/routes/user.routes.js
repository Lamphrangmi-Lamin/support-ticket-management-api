const express = require("express");
const { createUser } = require("../controllers/user.controller");

const userRouter = express.Router();

// POST /users
userRouter.post("/", createUser);

module.exports = userRouter;

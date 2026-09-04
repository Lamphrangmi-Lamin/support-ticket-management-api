const express = require("express");
const { createUser, getAllUsers } = require("../controllers/user.controller");

const userRouter = express.Router();

// POST /users
userRouter.post("/", createUser);
// GET /users
userRouter.get("/", getAllUsers);

module.exports = userRouter;

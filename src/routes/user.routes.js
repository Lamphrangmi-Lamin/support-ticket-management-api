const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
} = require("../controllers/user.controller");

const userRouter = express.Router();

// POST /users
userRouter.post("/", createUser);
// GET /users
userRouter.get("/", getAllUsers);
// GET /user/:id
userRouter.get("/:id", getUserById);

module.exports = userRouter;

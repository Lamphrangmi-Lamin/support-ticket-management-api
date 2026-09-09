const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  getTicketsByUserId,
} = require("../controllers/user.controller");

const userRouter = express.Router();

// POST /users
userRouter.post("/", createUser);
// GET /users
userRouter.get("/", getAllUsers);
// GET /user/:id
userRouter.get("/:id", getUserById);
// GET /users/:id/tickets
userRouter.get("/:id/tickets", getTicketsByUserId);

module.exports = userRouter;

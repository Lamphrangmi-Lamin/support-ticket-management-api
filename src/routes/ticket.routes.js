const express = require("express");
const {
  createTicket,
  getAllTickets,
} = require("../controllers/ticket.controller");
const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/", getAllTickets);

module.exports = ticketRouter;

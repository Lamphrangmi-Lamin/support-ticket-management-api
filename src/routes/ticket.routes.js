const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
} = require("../controllers/ticket.controller");
const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/", getAllTickets);
ticketRouter.get("/:id", getTicketById);

module.exports = ticketRouter;

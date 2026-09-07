const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketById,
} = require("../controllers/ticket.controller");
const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/", getAllTickets);
ticketRouter.get("/:id", getTicketById);
ticketRouter.patch("/:id", updateTicketById);

module.exports = ticketRouter;

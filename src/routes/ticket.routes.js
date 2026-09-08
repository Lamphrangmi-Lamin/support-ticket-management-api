const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketById,
  deleteTicketById,
} = require("../controllers/ticket.controller");
const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/", getAllTickets);
ticketRouter.get("/:id", getTicketById);
ticketRouter.patch("/:id", updateTicketById);
ticketRouter.delete("/:id", deleteTicketById);

module.exports = ticketRouter;

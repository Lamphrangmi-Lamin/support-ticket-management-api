const express = require("express");
const { createTicket } = require("../controllers/ticket.controller");
const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);

module.exports = ticketRouter;

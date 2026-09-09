const express = require("express");
const { getTicketsByAgentId } = require("../controllers/user.controller");
const agentRouter = express.Router();

agentRouter.get("/:id/tickets", getTicketsByAgentId);

module.exports = agentRouter;

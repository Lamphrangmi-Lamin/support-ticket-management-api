const express = require("express");
const userRouter = require("./routes/user.routes");
const ticketRouter = require("./routes/ticket.routes");
const agentRouter = require("./routes/agent.routes");

const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());
app.use("/users", userRouter);
app.use("/tickets", ticketRouter);
app.use("/agents", agentRouter);

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));

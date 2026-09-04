const { eq } = require("drizzle-orm");
const db = require("../db");
const { usersTable, ticketsTable } = require("../db/schema");

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, customer_id } = req.body;

    if (!title || title.trim() === "")
      return res.status(400).json({ error: `title is required` });

    if (!description || description.trim() === "")
      return res.status(400).json({ error: `description is required` });

    const allowedPriority = ["low", "medium", "high", "urgent"];

    if (!priority || !allowedPriority.includes(priority))
      return res.status(400).json({
        error: `Valid priority (low, medium, high, urgent), is required`,
      });

    if (!customer_id || isNaN(customer_id))
      return res
        .status(400)
        .json({ error: "A valid customer_id (number) is required" });

    const [existingUser] = await db
      .select({
        id: usersTable.id,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, customer_id));

    if (!existingUser)
      return res
        .status(404)
        .json({ error: `No user with ID ${customer_id} exists.` });

    if (existingUser.role !== "customer")
      return res
        .status(400)
        .json({ error: `User with id ${customer_id} is not a customer` });

    const [newTicket] = await db
      .insert(ticketsTable)
      .values({
        title,
        description,
        priority,
        customer_id,
      })
      .returning();

    return res.status(201).json({
      message: "New ticket raised successfully",
      newTicket,
    });
  } catch (error) {
    console.error("Error while creating ticket: ", error);
    return res.status(500).json({ error: `Internal server error` });
  }
};

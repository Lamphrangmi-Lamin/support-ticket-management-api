const { eq, asc } = require("drizzle-orm");
const db = require("../db");
const { commentsTable, usersTable, ticketsTable } = require("../db/schema");
const { error } = require("node:console");

// POST /tickets/:id/comments
exports.createCommentsByTicketId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || !Number.isInteger(id))
      return res.status(400).json({ error: `Invalid ID format` });

    const [existingTicket] = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .limit(1);

    if (!existingTicket)
      return res.status(404).json({ error: `No ticket with ID ${id} exists` });

    const { user_id, message } = req.body;

    if (!message || message.trim() === "")
      return res.status(400).json({ error: "Message is required" });

    if (isNaN(user_id) || !Number.isInteger(user_id) || !user_id)
      return res
        .status(400)
        .json({ error: `Valid user_id format is required` });

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user_id))
      .limit(1);

    if (!existingUser)
      return res
        .status(404)
        .json({ error: `No user found with ID ${user_id}` });

    const [newComment] = await db
      .insert(commentsTable)
      .values({ user_id, message, ticket_id: id })
      .returning();

    return res.status(201).json({ message: "New comment created", newComment });
    //
  } catch (error) {
    console.error("Error creating comments: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommentsByTicketId = async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);

    if (isNaN(ticketId) || !Number.isInteger(ticketId))
      return res.status(400).json({ error: `Invalid ID format` });

    const [existingTicket] = await db
      .select({ id: ticketsTable.id })
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId))
      .limit(1);

    if (!existingTicket)
      return res
        .status(404)
        .json({ error: `No ticket with ID ${ticketId} exists` });

    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.ticket_id, ticketId))
      .orderBy(asc(commentsTable.created_at))
      .limit(50);

    return res.status(200).json({
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });
    //
  } catch (error) {
    console.error("Error fetching comments: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const { eq, and, sql } = require("drizzle-orm");
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

// GET /tickets
// GET /tickets?status=open
// GET /tickets?priority=urgent
// GET /tickets?customer_id=1
// GET /tickets?agent_id=2
exports.getAllTickets = async (req, res) => {
  try {
    // extract all parameter query
    const { status, priority, customer_id, agent_id } = req.query;

    // Pagination setup with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Active filters
    const filters = [];

    if (status) {
      filters.push(eq(ticketsTable.status, status));
    }

    if (priority) {
      filters.push(eq(ticketsTable.priority, priority));
    }

    if (customer_id) {
      filters.push(eq(ticketsTable.customer_id, Number(customer_id)));
    }

    if (agent_id) {
      filters.push(eq(ticketsTable.assigned_agent_id, Number(agent_id)));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // Get total count for the meta data
    const [totalCountResult] = await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(ticketsTable)
      .where(whereClause);

    const total = totalCountResult.length;
    const totalPages = Math.ceil(total / limit);

    // Apply all filters using and() operator
    // Get all the paginated data
    const tickets = await db
      .select()
      .from(ticketsTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      data: tickets,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error while fetching tickets: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /tickets/:id
exports.getTicketById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || !Number.isInteger(id))
      return res.status(400).json({ error: "ID must be a valid integer" });

    const [existingTicket] = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .limit(1);

    if (!existingTicket)
      return res.status(404).json({ error: `No ticket with ID ${id} exists.` });

    return res.json(existingTicket);
  } catch (error) {
    console.error("Error fetching tickets: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

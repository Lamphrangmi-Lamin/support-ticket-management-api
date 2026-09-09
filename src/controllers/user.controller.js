const { eq } = require("drizzle-orm");
const db = require("../db");
const { usersTable, ticketsTable } = require("../db/schema");

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "Name is required" });

    if (!email || email.trim() === "")
      return res.status(400).json({ error: "Email is required" });

    const allowedRoles = ["customer", "agent", "manager"];

    if (!role || !allowedRoles.includes(role.toLowerCase()))
      return res
        .status(400)
        .json({ error: "Valid role is required (customer, agent, manager)" });

    // Database operation
    const [newUser] = await db
      .insert(usersTable)
      .values({ name, email, role })
      .returning();

    return res.status(201).json({
      message: "New user created successfully",
      user: newUser,
    });
  } catch (error) {
    if ((error.code = "23505")) {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.log("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.select().from(usersTable).limit(50);
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || !Number.isInteger(id))
      return res.status(400).json({ error: "id must be an integer" });

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!existingUser)
      return res.status(404).json({ error: `No user found with ID ${id}` });

    return res.json(existingUser);
  } catch (error) {
    console.error("Error while fetching user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /users/:id/tickets
exports.getTicketsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || !Number.isInteger(userId))
      return res.status(400).json({ error: "userId must be an integer" });

    const [existingUser] = await db
      .select({ id: usersTable.id, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!existingUser)
      return res.status(404).json({ error: `No user found with ID ${userId}` });

    if (existingUser.role !== "customer")
      return res.status(400).json({ error: "Invalid customer_id" });

    const tickets = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.customer_id, userId))
      .limit(50);

    return res.json({
      message: "Tickets fetched successfully",
      count: tickets.length,
      role: existingUser.role,
      tickets,
    });

    //
  } catch (error) {
    console.error("Error fetching tickets: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

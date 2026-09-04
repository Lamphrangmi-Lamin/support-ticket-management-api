const db = require("../db");
const { usersTable } = require("../db/schema");

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

    return res.status(201).json(newUser);
  } catch (error) {
    if ((error.code = "23505")) {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.log("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

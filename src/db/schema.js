const {
  pgTable,
  varchar,
  timestamp,
  serial,
  pgEnum,
  text,
  integer,
  index,
} = require("drizzle-orm/pg-core");

// Allowed roles strictly
const roleEnum = pgEnum("user_role", ["customer", "agent", "manager"]);

const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: roleEnum().default("customer").notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

const statusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

const priorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Tickets
const ticketsTable = pgTable(
  "tickets",
  {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    status: statusEnum().default("open").notNull(),
    priority: priorityEnum().notNull(),
    customer_id: integer()
      .references(() => usersTable.id)
      .notNull(),
    assigned_agent_id: integer().references(() => usersTable.id),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => {
    return {
      customerIdx: index("customer_idx").on(table.customer_id),
      agentIdx: index("agent_idx").on(table.assigned_agent_id),
      statusIdx: index("status_idx").on(table.status),
      priorityIdx: index("priority_idx").on(table.priority),
      // composite index
      statusPriorityIdx: index("status_priority_idx").on(
        table.status,
        table.priority,
      ),
    };
  },
);

const commentsTable = pgTable("comments", {
  id: serial().primaryKey(),
  ticket_id: integer()
    .references(() => ticketsTable.id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer()
    .references(() => usersTable.id)
    .notNull(),
  message: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

const ticketHistoryTable = pgTable("ticket_history", {
  id: serial().primaryKey(),
  ticket_id: integer()
    .references(() => ticketsTable.id)
    .notNull(),
  old_status: statusEnum().notNull(),
  new_status: statusEnum().notNull(),
  changed_by: integer()
    .references(() => usersTable.id)
    .notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

module.exports = {
  roleEnum,
  usersTable,
  statusEnum,
  priorityEnum,
  ticketHistoryTable,
  ticketsTable,
  commentsTable,
};

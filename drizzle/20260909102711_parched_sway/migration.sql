CREATE TYPE "ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('customer', 'agent', 'manager');--> statement-breakpoint
CREATE TYPE "ticket_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY,
	"ticket_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_history" (
	"id" serial PRIMARY KEY,
	"ticket_id" integer NOT NULL,
	"old_status" "ticket_status" NOT NULL,
	"new_status" "ticket_status" NOT NULL,
	"changed_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'open'::"ticket_status" NOT NULL,
	"priority" "ticket_priority" NOT NULL,
	"customer_id" integer NOT NULL,
	"assigned_agent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"role" "user_role" DEFAULT 'customer'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "customer_idx" ON "tickets" ("customer_id");--> statement-breakpoint
CREATE INDEX "agent_idx" ON "tickets" ("assigned_agent_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "tickets" ("status");--> statement-breakpoint
CREATE INDEX "priority_idx" ON "tickets" ("priority");--> statement-breakpoint
CREATE INDEX "status_priority_idx" ON "tickets" ("status","priority");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");--> statement-breakpoint
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_changed_by_users_id_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_agent_id_users_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id");
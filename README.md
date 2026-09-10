# Support Ticket Management API

REST API for managing users, support tickets, ticket comments, and ticket assignments.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Drizzle ORM

## Requirements

- Node.js 18+
- npm
- Docker and Docker Compose

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

The default database container uses:

| Setting  | Value                          |
| -------- | ------------------------------ |
| Host     | `localhost`                    |
| Port     | `5432`                         |
| Database | `support_ticket_management_db` |
| User     | `admin`                        |
| Password | `rootpassword`                 |

### 3. Configure the database connection

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/support_ticket_management_db
```

### 4. Start the API

```bash
node src/server.js
```

The server listens on `http://localhost:8000`.

## API Conventions

- Content type: `application/json`
- Authentication: not currently implemented
- IDs are positive integer database IDs.
- Timestamps are returned by PostgreSQL and use ISO 8601 format in JSON responses.

## Resources

### Users

#### Create a user

```http
POST /users
Content-Type: application/json
```

Request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "customer"
}
```

`role` must be one of `customer`, `agent`, or `manager`.

Response `201 Created`:

```json
{
  "message": "New user created successfully",
  "user": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "customer",
    "created_at": "2026-09-10T12:00:00.000Z"
  }
}
```

#### List users

```http
GET /users
```

Returns up to 50 users.

#### Get a user

```http
GET /users/:id
```

#### Get tickets created by a customer

```http
GET /users/:id/tickets
```

The user must have the `customer` role.

Response `200 OK`:

```json
{
  "message": "Tickets fetched successfully",
  "count": 1,
  "role": "customer",
  "tickets": []
}
```

### Tickets

#### Create a ticket

```http
POST /tickets
Content-Type: application/json
```

Request body:

```json
{
  "title": "Unable to sign in",
  "description": "The password reset link is not working.",
  "priority": "high",
  "customer_id": 1
}
```

`priority` must be one of `low`, `medium`, `high`, or `urgent`. The `customer_id` must belong to a user with the `customer` role.

Response `201 Created`:

```json
{
  "message": "New ticket raised successfully",
  "newTicket": {}
}
```

#### List tickets

```http
GET /tickets
```

Optional query parameters:

| Parameter     | Description                                              |
| ------------- | -------------------------------------------------------- |
| `status`      | Filter by `open`, `in_progress`, `resolved`, or `closed` |
| `priority`    | Filter by `low`, `medium`, `high`, or `urgent`           |
| `customer_id` | Filter by customer ID                                    |
| `agent_id`    | Filter by assigned agent ID                              |
| `page`        | Page number, default `1`                                 |
| `limit`       | Page size, default `10`                                  |

Example:

```http
GET /tickets?status=open&priority=urgent&page=1&limit=10
```

Response `200 OK`:

```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 0
}
```

#### Get a ticket

```http
GET /tickets/:id
```

#### Update a ticket

```http
PATCH /tickets/:id
Content-Type: application/json
```

Any combination of the following fields may be supplied:

```json
{
  "status": "in_progress",
  "priority": "urgent",
  "assigned_agent_id": 2
}
```

`assigned_agent_id` may be `null` to unassign a ticket. Assignments may target an `agent` or `manager`.

Response `200 OK`:

```json
{
  "message": "ticket updated successfully",
  "updatedTicket": {}
}
```

#### Delete a ticket

```http
DELETE /tickets/:id
```

Response `200 OK`:

```json
{
  "message": "Ticket 1 deleted successfully"
}
```

#### Get ticket statistics

```http
GET /tickets/stats
```

Response `200 OK`:

```json
{
  "message": "Ticket statistics retrieved successfully",
  "stats": {
    "total": 10,
    "open": 4,
    "inProgress": 3,
    "resolved": 2,
    "closed": 1
  }
}
```

#### List ticket comments

```http
GET /tickets/:id/comments
```

Returns up to 50 comments ordered by creation time.

Response `200 OK`:

```json
{
  "message": "Comments fetched successfully",
  "count": 1,
  "comments": []
}
```

#### Add a ticket comment

```http
POST /tickets/:id/comments
Content-Type: application/json
```

Request body:

```json
{
  "user_id": 2,
  "message": "We are investigating this issue."
}
```

Response `201 Created`:

```json
{
  "message": "New comment created",
  "newComment": {}
}
```

### Agents

#### Get tickets assigned to an agent

```http
GET /agents/:id/tickets
```

The user must have the `agent` role. The response contains up to 50 assigned tickets:

```json
{
  "message": "Tickets fetched successfully",
  "count": 1,
  "role": "agent",
  "tickets": []
}
```

## Common Error Responses

```json
{
  "error": "Description of the error"
}
```

Common status codes:

| Status | Meaning                             |
| ------ | ----------------------------------- |
| `201`  | Resource created                    |
| `200`  | Request succeeded                   |
| `400`  | Invalid input                       |
| `404`  | Resource not found                  |
| `409`  | Conflict, such as a duplicate email |
| `500`  | Internal server error               |

## Project Structure

```text
src/
	controllers/   Request handlers
	db/            Drizzle connection and schema
	routes/        Express route definitions
	server.js      Application entry point
```

## Scripts

The project currently does not define npm scripts. Run the server directly with:

```bash
node src/server.js
```

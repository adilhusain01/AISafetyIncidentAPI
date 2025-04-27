# AI Safety Incident Log API

A RESTful API service for logging and managing AI safety incidents. Built with Node.js, Express, PostgreSQL, and Redis, focusing on robustness and efficiency.

## Features

- CRUD operations for incidents (Create, Read, Delete).
- Input validation for API requests.
- Redis caching for GET requests to improve performance.
- Structured logging using Winston and Morgan.
- Centralized error handling.
- Environment variable-based configuration.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Caching**: Redis
- **Validation**: express-validator
- **Logging**: Winston (Application Logs) & Morgan (HTTP Request Logs)
- **Security**: Helmet (Basic security headers), CORS

## Prerequisites

- Node.js (v14 or later recommended)
- PostgreSQL Server
- Redis Server

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url> # Replace with your repo URL
    cd incident-log-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file and provide the correct values for your environment. See the [Environment Variables](#environment-variables) section below for details.

4.  **Set up PostgreSQL Database:**

    - Ensure your PostgreSQL server is running.
    - Create a database (e.g., `aihuman_incidents` as specified in the default `.env`).
    - The application uses Sequelize's `sync()` method, which will automatically create the necessary tables based on the defined models when the application starts.

5.  **Ensure Redis Server is Running:**
    - Make sure your Redis server is running and accessible based on the `REDIS_HOST` and `REDIS_PORT` in your `.env` file.

## Running the Application

1.  **Start the server:**

    - For production mode:
      ```bash
      npm start
      ```
    - For development mode (with automatic restarts on file changes using `nodemon`):
      ```bash
      npm run dev
      ```

2.  The server will start on the port specified in your `.env` file (default is 3000). You should see console messages indicating successful database connection and the server running port.

## Environment Variables

The following environment variables are used for configuration. Set them in the `.env.example` file:

| Variable      | Description                                           | Default (`.env.example`) |
| ------------- | ----------------------------------------------------- | ------------------------ |
| `NODE_ENV`    | Application environment (`development`, `production`) | `development`            |
| `PORT`        | Port the server listens on                            | `3000`                   |
| `DB_HOST`     | PostgreSQL database host                              | `localhost`              |
| `DB_PORT`     | PostgreSQL database port                              | `5432`                   |
| `DB_NAME`     | PostgreSQL database name                              | `aihuman_incidents`      |
| `DB_USER`     | PostgreSQL database user                              | `postgres`               |
| `DB_PASSWORD` | PostgreSQL database password                          | `postgres`               |
| `REDIS_HOST`  | Redis server host                                     | `localhost`              |
| `REDIS_PORT`  | Redis server port                                     | `6379`                   |

## API Endpoints

The base URL for the API is `/`.

### Health Check

- **GET /health**
  - **Description**: Checks if the server is running.
  - **Response (200 OK)**:
    ```json
    {
      "status": "ok",
      "message": "Server is running"
    }
    ```

### Incidents

Base path: `/incidents`

- **POST /**

  - **Description**: Creates a new incident.
  - **Request Body**: JSON object with incident details.
    - `title` (string, required, 3-200 characters)
    - `description` (string, required)
    - `severity` (string, required, must be one of: `Low`, `Medium`, `High`)
  - **Response (201 Created)**: The newly created incident object.
    ```json
    {
      "id": 1,
      "title": "Example Incident",
      "description": "This is a test incident.",
      "severity": "Medium",
      "updatedAt": "2025-04-27T17:15:00.000Z",
      "createdAt": "2025-04-27T17:15:00.000Z"
    }
    ```
  - **Response (400 Bad Request - Validation Error)**:
    ```json
    {
      "status": "error",
      "errors": [
        {
          "type": "field",
          "value": "",
          "msg": "Title is required",
          "path": "title",
          "location": "body"
        }
        // ... other errors
      ]
    }
    ```
  - **Example**:
    ```bash
    curl -X POST http://localhost:3000/incidents \
      -H "Content-Type: application/json" \
      -d '{"title":"Unauthorized Access","description":"System accessed restricted data.","severity":"High"}'
    ```

- **GET /**

  - **Description**: Retrieves all incidents. Results may be served from cache.
  - **Response (200 OK)**: An array of incident objects.
    ```json
    [
      {
        "id": 1,
        "title": "Example Incident",
        "description": "This is a test incident.",
        "severity": "Medium",
        "createdAt": "2025-04-27T17:15:00.000Z",
        "updatedAt": "2025-04-27T17:15:00.000Z"
      }
      // ... other incidents
    ]
    ```
  - **Example**:
    ```bash
    curl -X GET http://localhost:3000/incidents
    ```

- **GET /:id**

  - **Description**: Retrieves a specific incident by its ID. Results may be served from cache.
  - **Path Parameter**: `id` (integer, required) - The ID of the incident to retrieve.
  - **Response (200 OK)**: The requested incident object.
    ```json
    {
      "id": 1,
      "title": "Example Incident",
      "description": "This is a test incident.",
      "severity": "Medium",
      "createdAt": "2025-04-27T17:15:00.000Z",
      "updatedAt": "2025-04-27T17:15:00.000Z"
    }
    ```
  - **Response (400 Bad Request - Invalid ID)**: If `id` is not an integer.
    ```json
    {
      "status": "error",
      "errors": [
        {
          "type": "field",
          "value": "abc", // The invalid ID provided
          "msg": "Incident ID must be an integer",
          "path": "id",
          "location": "params"
        }
      ]
    }
    ```
  - **Response (404 Not Found)**: If no incident with the given `id` exists.
    ```json
    {
      "status": "error",
      "message": "Incident with id=999 was not found"
    }
    ```
  - **Example**:
    ```bash
    curl -X GET http://localhost:3000/incidents/1
    ```

- **DELETE /:id**
  - **Description**: Deletes a specific incident by its ID. Invalidates relevant cache entries.
  - **Path Parameter**: `id` (integer, required) - The ID of the incident to delete.
  - **Response (200 OK)**: Success message.
    ```json
    {
      "status": "success",
      "message": "Incident was deleted successfully!"
    }
    ```
  - **Response (400 Bad Request - Invalid ID)**: If `id` is not an integer (similar structure to GET /:id).
  - **Response (404 Not Found)**: If no incident with the given `id` exists.
    ```json
    {
      "status": "error",
      "message": "Cannot delete Incident with id=999. Maybe Incident was not found!"
    }
    ```
  - **Example**:
    ```bash
    curl -X DELETE http://localhost:3000/incidents/1
    ```

## Caching

- Redis is used to cache responses for `GET /incidents` and `GET /incidents/:id` to reduce database load and improve response times.
- The cache duration is set to 300 seconds (5 minutes) by default in the controller.
- The cache for `all_incidents` and specific `incident_{id}` is automatically invalidated when a new incident is created (`POST /incidents`) or an existing one is deleted (`DELETE /incidents/:id`).

## Logging

- **Application Logs**: Detailed logs (info, warnings, errors) are written to `logs/app.log` and `logs/error.log` using Winston.
- **HTTP Request Logs**: Incoming HTTP requests are logged in 'combined' format to `logs/app.log` using Morgan, integrated via a Winston stream.

## Error Handling

- **Validation Errors**: Requests that fail validation rules (e.g., missing fields, incorrect types) will receive a `400 Bad Request` response with details about the errors.
- **Not Found Errors**: Trying to access or delete a non-existent incident by ID will result in a `404 Not Found` response.
- **Server Errors**: Any other unhandled errors during request processing will trigger the centralized error handler, resulting in a `500 Internal Server Error` response. The error details (including stack trace in development mode) are logged.
  - **Generic Error Response Structure**:
    ```json
    {
      "status": "error",
      "statusCode": 500,
      "message": "Specific error message or 'Internal Server Error'"
    }
    ```

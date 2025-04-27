# AI Safety Incident Log API

A RESTful API service for logging and managing AI safety incidents, built for HumanChain's mission in AI safety.

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Caching**: Redis (optional)
- **Logging**: Winston and Morgan

## Setup Instructions

### Prerequisites Install First in your PC (Instructions are more compatible with Linux as i use Arch Linux)

- Node.js (v14 or later)
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/incident-log-api.git
   cd incident-log-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file by copying `.env.example` and updating the values:

   ```
   cp .env.example .env
   ```

4. Set up your PostgreSQL database:
   - Create a database named `aihuman_incidents`
   - Update the database credentials in your `.env` file

### Running the Application

1. Start the server:

   ```
   npm start
   ```

   For development with auto-reload:

   ```
   npm run dev
   ```

2. The server will start on port 3000 by default (configurable in `.env`)

### Database Setup

The application will automatically create the tables when it starts. If you want to pre-populate with sample data, you can run the following SQL in your PostgreSQL client:

```sql
INSERT INTO incidents (title, description, severity, reported_at, "createdAt", "updatedAt")
VALUES
('Unauthorized Data Access', 'AI system accessed restricted medical records through an authentication bypass vulnerability.', 'High', NOW(), NOW(), NOW()),
('Biased Output Generation', 'AI generated content displayed gender bias in job recommendation outputs.', 'Medium', NOW(), NOW(), NOW()),
('Privacy Leak', 'AI model inadvertently revealed personal information in responses to certain prompts.', 'High', NOW(), NOW(), NOW());
```

## API Endpoints

### GET /incidents

- **Description**: Retrieve all incidents
- **Request**: No parameters required
- **Response**: 200 OK with an array of incident objects
- **Example**:
  ```bash
  curl -X GET http://localhost:3000/incidents
  ```

### POST /incidents

- **Description**: Create a new incident
- **Request Body**: JSON object with title, description, and severity
- **Response**: 201 Created with the newly created incident object
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/incidents \
    -H "Content-Type: application/json" \
    -d '{"title":"New Incident","description":"Description of the incident","severity":"Medium"}'
  ```

### GET /incidents/:id

- **Description**: Retrieve a specific incident by ID
- **Path Parameter**: id - The incident ID
- **Response**: 200 OK with the incident object, or 404 Not Found
- **Example**:
  ```bash
  curl -X GET http://localhost:3000/incidents/1
  ```

### DELETE /incidents/:id

- **Description**: Delete an incident by ID
- **Path Parameter**: id - The incident ID
- **Response**: 200 OK with success message, or 404 Not Found
- **Example**:
  ```bash
  curl -X DELETE http://localhost:3000/incidents/1
  ```

## Design Decisions

- **Folder Structure**: Organized codebase with separate models, controllers, routes, and config for maintainability.
- **Data Validation**: Used express-validator for input validation to ensure data integrity.
- **Error Handling**: Centralized error handling middleware to provide consistent error responses.
- **Caching**: Optional Redis caching for improved performance on frequently accessed data.
- **Logging**: Comprehensive logging with Winston for application logs and Morgan for HTTP request logs.
- **Database Indexes**: Added indexes on frequently queried fields for better performance.

## Future Improvements

- Add authentication and authorization
- Implement pagination for the GET /incidents endpoint
- Add filters and search functionality
- Implement unit and integration testing
- Add Swagger documentation

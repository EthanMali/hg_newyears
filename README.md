# Registration App

A full-stack registration application built with React TypeScript and Node.js Express.

## Features

- **Registration Form**: Beautiful, responsive registration form with validation
- **Full CRUD API**: Complete REST API for user management
  - POST `/api/register` - Create new user
  - GET `/api/users` - Get all users
  - GET `/api/users/:id` - Get specific user
  - PUT `/api/users/:id` - Update user
  - PATCH `/api/users/:id` - Partial update
  - DELETE `/api/users/:id` - Delete user

## Project Structure

```
Alex_Client/
├── client/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── RegistrationForm.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── server/          # Node.js Express backend
│   ├── server.js
│   ├── data/        # JSON data storage (auto-created)
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Install Dependencies

1. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

### Running the Application

1. **Start the Server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Start the Client:**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:3000`

## API Endpoints

### Registration
- **POST** `/api/register`
  - Body: `{ firstName, lastName, email, password, phone }`
  - Creates a new user account

### Get All Users
- **GET** `/api/users`
  - Returns all registered users (without passwords)

### Get User by ID
- **GET** `/api/users/:id`
  - Returns a specific user by ID

### Update User
- **PUT** `/api/users/:id`
  - Body: `{ firstName?, lastName?, email?, password?, phone? }`
  - Updates a user (allows partial updates)

### Partial Update
- **PATCH** `/api/users/:id`
  - Body: `{ field: value }`
  - Partially updates a user

### Delete User
- **DELETE** `/api/users/:id`
  - Deletes a user by ID

## Data Storage

User data is stored in `server/data/users.json`. This file is automatically created when the server starts.

## Notes

- Passwords are stored in plain text for simplicity. **In production, always hash passwords using bcrypt or similar.**
- The server uses CORS to allow requests from the React client.
- All API responses follow a consistent format with `success` and `message` fields.

## Future Enhancements

- Add password hashing (bcrypt)
- Add authentication (JWT tokens)
- Add database integration (MongoDB, PostgreSQL, etc.)
- Add email verification
- Add password reset functionality
- Add user profile images
- Add pagination for user list


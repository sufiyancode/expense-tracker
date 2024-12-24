```markdown
# Expense Tracker MERN Application

A full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users manage their income and expenses.

## Live Demo

- Frontend: https://expense-frotend.vercel.app
- Backend API: https://expense-tracker-mu-sage-83.vercel.app

## Features

- User authentication (signup/login)
- Add, update, and delete transactions
- Track income and expenses
- Real-time balance calculation
- Responsive design with Tailwind CSS
- Protected routes
- JWT authentication

## Project Structure

expense-tracker/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── config/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
└── backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
├── index.js
└── package.json
```

## Tech Stack

### Frontend Dependencies

```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "lucide-react": "^0.469.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.5",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-validator": "^7.2.0",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.2",
    "morgan": "^1.10.0"
  }
}
```

## API Routes Documentation

### Authentication Routes

```
POST /api/v1/users/register
- Register a new user
- Body: { name, email, password }
- Returns: { token, user }

POST /api/v1/users/login
- Login user
- Body: { email, password }
- Returns: { token, user }

GET /api/v1/users/profile
- Get user profile (Protected)
- Headers: Authorization: Bearer {token}
- Returns: { user }

PUT /api/v1/users/profile
- Update user profile (Protected)
- Headers: Authorization: Bearer {token}
- Body: { name, email, password }
- Returns: { user }
```

### Transaction Routes

```
GET /api/v1/transactions
- Get all transactions
- Headers: Authorization: Bearer {token}
- Returns: { success, count, data }

POST /api/v1/transactions
- Add new transaction
- Headers: Authorization: Bearer {token}
- Body: { text, amount }
- Returns: { success, data }

PUT /api/v1/transactions/:id
- Update transaction
- Headers: Authorization: Bearer {token}
- Body: { text, amount }
- Returns: { success, data }

DELETE /api/v1/transactions/:id
- Delete transaction
- Headers: Authorization: Bearer {token}
- Returns: { success, data }
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=your_backend_api_url
```

## Local Development Setup

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd frontend
npm install
```

3. Configure environment variables

- Create .env files in both frontend and backend directories
- Add the required environment variables

4. Run development servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Security Implementations

### CORS Configuration

```javascript
app.use(
  cors({
    origin: [
      "https://expense-frotend.vercel.app",
      "https://deploy-mern-1whq.vercel.app",
      "http://localhost:5173",
      "https://expense-tracker-mu-sage-83.vercel.app",
    ],
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
```

### Authentication Middleware

```javascript
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      next(new ApiError("Unauthorized, invalid token", 401));
    }
  } else {
    next(new ApiError("Unauthorized, no token provided", 401));
  }
};
```

## Deployment

### Frontend Deployment (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables must be configured in Vercel dashboard

### Backend Deployment (Vercel)

- Configuration file: vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

## Error Handling

The application implements a global error handling middleware that:

- Provides detailed errors in development
- Sends sanitized errors in production
- Handles JWT and validation errors
- Implements proper error logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

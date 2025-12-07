# Pawn to Glory - Chess News Website

เว็บไซต์ข่าวสารหมากรุก MERN-Stack พร้อมระบบ Admin และ Authentication

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, React Router, i18next
- **Backend**: Node.js, Express.js, MongoDB Atlas, JWT
- **Features**: Bilingual (Thai/English), Admin Dashboard, Article Management

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp server/.env.example server/.env

# Update server/.env with your MongoDB URI and JWT secret
```

### Development

```bash
# Run both client and server
npm run dev

# Or run separately
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:5000
```

### First-Time Setup

1. Start the server
2. Register a new account at `/register`
3. Open MongoDB and manually set `role: "admin"` for your user
4. Login and access admin at `/admin`

## Project Structure

```
pawntoglory.com/
├── client/               # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout wrappers
│   │   ├── context/      # React Context
│   │   ├── i18n/         # Translations
│   │   └── styles/       # CSS
│   └── ...
├── server/               # Express Backend
│   ├── config/           # Database config
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── server.js
└── package.json          # Root workspace
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Articles
- `GET /api/articles` - List articles (public)
- `GET /api/articles/:slug` - Single article
- `POST /api/articles` - Create (editor)
- `PUT /api/articles/:id` - Update (editor)
- `DELETE /api/articles/:id` - Delete (editor)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create (admin)
- `PUT /api/categories/:id` - Update (admin)
- `DELETE /api/categories/:id` - Delete (admin)

### Users
- `GET /api/users` - List users (admin)
- `PUT /api/users/:id` - Update (admin)
- `DELETE /api/users/:id` - Delete (admin)

## License

MIT

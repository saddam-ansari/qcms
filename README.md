# QCMS - Quality Control Management System

A comprehensive full-stack application for managing quality control inspections and defects. Built with React on the frontend and Node.js/Express on the backend.

## 📋 Project Overview

QCMS is a role-based quality control management system designed for organizations that need to track and manage quality inspections and defects. The system supports different user roles with specific permissions and provides a complete workflow for inspection and defect management.

## ✨ Features

- **User Authentication & Authorization**: Secure login/registration with role-based access control
- **Dashboard**: Overview of inspections and defects with key metrics
- **Inspection Management**: Create, read, update, and delete inspections
- **Defect Management**: Track and manage quality defects with detailed information
- **Role-Based Access**: Different features available based on user roles (Manager, Inspector)
- **Protected Routes**: Secure navigation with token verification
- **Responsive UI**: Clean and intuitive user interface

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Client-side routing
- **CSS** - Styling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Database** - (Database system used in the project)
- **JWT** - Authentication tokens

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── logo192.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.js (Route protection wrapper)
│   │   └── navbar/
│   │       ├── Navbar.js (Navigation component)
│   │       └── Navbar.css
│   ├── pages/
│   │   ├── login/ (User authentication)
│   │   ├── registration/ (User registration)
│   │   ├── dashboard/ (Main dashboard)
│   │   ├── inspection/ (Inspection pages)
│   │   └── defect/ (Defect pages)
│   ├── redux/
│   │   ├── authSlice.js (Redux authentication state)
│   │   └── store.js (Redux store configuration)
│   ├── services/
│   │   └── api.js (API client)
│   ├── App.js (Main app component)
│   └── index.js (Entry point)

backend/
├── controllers/ (Business logic)
├── models/ (Database models)
├── routes/ (API routes)
├── middleware/ (Auth & role verification)
├── db.js (Database connection)
└── server.js (Server setup)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qcms
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` file in backend folder with required configurations

### Running the Application

**Terminal 1 - Start Backend Server**
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000` (or configured port)

**Terminal 2 - Start Frontend Development Server**
```bash
cd frontend
npm start
```
Application opens at `http://localhost:3000`

## 👥 User Roles & Permissions

### Manager
- View dashboard with all metrics
- Create, read, update, and delete inspections
- Create, read, update, and delete defects
- Add new inspections

### Inspector
- View dashboard (read-only)
- View inspections and defects
- Edit inspections
- Add defects
- Limited administrative access

## 📋 Available Routes

### Authentication
- `GET /` → Redirects to `/login`
- `POST /login` → User login
- `POST /register` → User registration

### Protected Routes (Authentication Required)
- `GET /dashboard` → Main dashboard
- `GET /inspections` → List all inspections
- `POST /add-inspection` → Create new inspection
- `PUT /edit-inspection/:id` → Update inspection
- `GET /defects` → List all defects
- `POST /add-defect` → Create new defect
- `PUT /edit-defect/:id` → Update defect

## 🔒 Security Features

- JWT Token-based authentication
- Protected routes with role verification
- Middleware for token validation
- Role-based access control (RBAC)
- Secure logout functionality

## 📦 Available Scripts

### Frontend Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject configuration (one-way operation)
npm run eject
```

### Backend Scripts
```bash
# Start server
npm start

# Development mode (with nodemon)
npm run dev
```

## 🔧 Configuration

### API Configuration
- Backend API base URL is configured in `src/services/api.js`
- Update the API endpoint if backend server is running on a different port

### Redux Store
- Authentication state is managed in `redux/authSlice.js`
- Global state includes user token, role, and authentication status

## 📝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request
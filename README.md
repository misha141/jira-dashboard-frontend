# Jira Dashboard - Frontend

This is the frontend of the Jira-like task management app built using **React**.

## 🔧 Tech Stack
- React
- React Router
- Axios
- CSS

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)


```bash
# Navigate to the frontend folder
cd jira-dashboard-frontend

# Install dependencies
npm install

# Running the App
npm start
Open http://localhost:3000 to view it in your browser.
```

## Project Structure
```bash
src/
│
├── pages/             # All main pages (Login, Register, Dashboard, Profile)
├── components/        # Reusable components (LogoutButton, etc.)
├── App.js             # Main routing logic
└── index.js           # App entry point
```

## Authentication
- JWT token is stored in localStorage.
- Private routes are protected using a PrivateRoute component.
- Logout clears the token and redirects to login.

## Features(MVP)
- User Registration & Login
- Dashboard with navigation
- Protected Profile page
- Project and Task Management (in progress)

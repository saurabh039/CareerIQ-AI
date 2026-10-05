import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile/Profile";
import Resume from "./pages/Resume/Resume";

function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>🎉 CareerIQ AI Dashboard</h1>

      <p>Authentication Successful</p>

      <br />

      <Link to="/jobs">
        <button>View Jobs</button>
      </Link>

      <br />
      <br />

      <Link to="/resume">
        <button>Upload Resume</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
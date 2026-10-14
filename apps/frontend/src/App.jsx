import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile/Profile";
import Resume from "./pages/Resume/Resume";

import { useAuth } from "./context/AuthContext";
import { Button } from "./components/ui/button";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">🎉 CareerIQ AI Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Logged in as: <span className="font-semibold text-foreground">{user?.email || "Authenticated User"}</span>
            {user?.fullName && <span className="text-muted-foreground"> ({user.fullName})</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/jobs">
            <Button variant="outline" className="w-full justify-center">
              💼 View Jobs
            </Button>
          </Link>
          <Link to="/resume">
            <Button variant="outline" className="w-full justify-center">
              📄 Resume Intelligence
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-center">
              👤 Career Profile
            </Button>
          </Link>
        </div>

        <div className="border-t pt-6 flex justify-end">
          <Button variant="destructive" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
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
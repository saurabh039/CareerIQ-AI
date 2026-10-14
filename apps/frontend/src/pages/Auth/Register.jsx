import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName: form.fullName.trim() || form.email.split("@")[0],
        email: form.email.trim(),
        password: form.password,
      });

      toast.success("Registration successful! Please sign in with your credentials.");
      navigate("/login", { state: { email: form.email.trim() } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">CareerIQ AI</h1>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Create Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign up to start practicing and exploring career opportunities
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Full Name (Optional)
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Vishal Sharma"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold mt-2"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </Button>
        </form>

        {/* Login Link */}
        <div className="pt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
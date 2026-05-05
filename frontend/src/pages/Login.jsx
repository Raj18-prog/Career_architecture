import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <h1>Welcome back</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit">Login</button>
        </form>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

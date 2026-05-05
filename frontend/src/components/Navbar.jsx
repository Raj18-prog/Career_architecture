import { BrainCircuit, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <BrainCircuit size={24} />
        <span>Career Architect</span>
      </Link>

      {isAuthenticated ? (
        <nav className="nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/plans">Plans</NavLink>
          <span className="user-chip">{user?.name}</span>
          <button className="icon-button" onClick={logout} title="Log out" type="button">
            <LogOut size={18} />
          </button>
        </nav>
      ) : (
        <nav className="nav">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>
      )}
    </header>
  );
}

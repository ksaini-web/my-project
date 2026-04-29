import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (login(username, password)) {
      toast.success("Login successful");
      navigate("/dashboard");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 border"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Voucher Login
        </h1>

        <input
          className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Username: admin / staff"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full border px-4 py-2 rounded mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700">
          Login
        </button>

        <p className="text-xs text-center mt-5 text-slate-500">
          Admin: admin/admin123 | Staff: staff/staff123
        </p>
      </form>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "admin", password: "admin123" });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      login(form);
      setError("");
      window.location.hash = "list";
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">
            Voucher Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Admin: admin or admin@example.com / admin123
          </p>
          <p className="text-sm text-slate-500">
            Staff: staff or staff@example.com / staff123
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Username or Email
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

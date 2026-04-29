import { useAuth } from "../context/AuthContext";

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "list", label: "Vouchers" },
    { id: "create", label: "Create Voucher" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-950">
            Voucher Management
          </h1>
          <p className="text-sm capitalize text-slate-500">
            {user?.name} · {user?.role}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentPage === item.id
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

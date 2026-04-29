import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VoucherProvider } from "./context/VoucherContext";
import CreateVoucher from "./pages/CreateVoucher";
import EditVoucher from "./pages/EditVoucher";
import Login from "./pages/Login";
import VoucherList from "./pages/VoucherList";

function getHashRoute() {
  const hash = window.location.hash.replace("#", "");
  return hash || "list";
}

function ProtectedApp() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [route, setRoute] = useState(getHashRoute);
  const [editingVoucherId, setEditingVoucherId] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getHashRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const startEdit = (voucherId) => {
    if (!isAdmin) {
      return;
    }

    setEditingVoucherId(voucherId);
    navigate("edit");
  };

  let page = (
    <VoucherList
      onEdit={startEdit}
    />
  );

  if (route === "create") {
    page = <CreateVoucher onCreated={() => navigate("list")} />;
  }

  if (route === "edit") {
    page = isAdmin ? (
      <EditVoucher
        voucherId={editingVoucherId}
        onCancel={() => navigate("list")}
        onSaved={() => navigate("list")}
      />
    ) : (
      <VoucherList onEdit={startEdit} />
    );
  }

  return (
    <VoucherProvider>
      <div className="min-h-screen bg-slate-100">
        <Navbar currentPage={route} onNavigate={navigate} />
        {page}
      </div>
    </VoucherProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}

import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useVouchers } from "../context/VoucherContext";

export default function VoucherList({ onEdit }) {
  const { isAdmin } = useAuth();
  const { vouchers, deleteVoucher } = useVouchers();
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    type: "ALL",
    narration: "",
  });
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const matchesFromDate =
        !filters.fromDate || voucher.date >= filters.fromDate;
      const matchesToDate = !filters.toDate || voucher.date <= filters.toDate;
      const matchesType = filters.type === "ALL" || voucher.type === filters.type;
      const matchesNarration = voucher.narration
        .toLowerCase()
        .includes(filters.narration.toLowerCase());

      return matchesFromDate && matchesToDate && matchesType && matchesNarration;
    });
  }, [filters, vouchers]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const confirmDelete = () => {
    deleteVoucher(voucherToDelete.id);
    setVoucherToDelete(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Voucher Index
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Filter vouchers by date range, voucher type, and narration.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-600">
          {filteredVouchers.length} of {vouchers.length} vouchers
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 bg-indigo-300 p-4 shadow-sm">
        <div className="grid gap-3 text-xs md:grid-cols-5">
          <label className="grid gap-1 font-medium text-slate-700">
            From Date
            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            To Date
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => updateFilter("toDate", event.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Voucher Type
            <select
              value={filters.type}
              onChange={(event) => updateFilter("type", event.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              <option>ALL</option>
              <option>Payment</option>
              <option>Received</option>
            </select>
          </label>
          <label className="grid gap-1 font-medium text-slate-700 md:col-span-2">
            Narration Search
            <input
              value={filters.narration}
              onChange={(event) => updateFilter("narration", event.target.value)}
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Search narration"
            />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-indigo-300 text-xs uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Narration</th>
                <th className="px-4 py-3">Total Debit</th>
                <th className="px-4 py-3">Total Credit</th>
                {isAdmin && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id} className="align-top">
                  <td className="px-4 py-4 text-slate-700">{voucher.date}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {voucher.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-950">
                      {voucher.narration}
                    </div>
                    <div className="text-xs text-slate-500">
                      {voucher.id} · Voucher No {voucher.voucherNo}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-950">
                    Rs. {Number(voucher.totalDebit || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-950">
                    Rs. {Number(voucher.totalCredit || 0).toLocaleString("en-IN")}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(voucher.id)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoucherToDelete(voucher)}
                          className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {!filteredVouchers.length && (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No vouchers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {voucherToDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-950">
              Delete voucher?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete {voucherToDelete.id}. This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setVoucherToDelete(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

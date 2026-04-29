import { useMemo, useState } from "react";

const accountOptions = [
  "Cash Account",
  "Bank Account",
  "Sales Account",
  "Purchase Account",
  "Office Expense",
  "TDS Payable",
];

const blankRow = () => ({
  id: `ROW-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  account: "",
  amount: "",
  tdsApplicable: "No",
  tdsType: "",
  billNo: "",
  mode: "NA",
  referenceNo: "",
});

const initialForm = {
  group: "CASH",
  voucherNo: "",
  date: new Date().toISOString().slice(0, 10),
  type: "Payment",
  narration: "On Account",
  remarks: "",
  accountHead: "",
  rows: [blankRow()],
};

export default function VoucherForm({
  voucher,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(voucher ?? initialForm);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const rowTotal = form.rows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    return {
      debit: form.type === "Payment" ? rowTotal : 0,
      credit: form.type === "Received" ? rowTotal : 0,
    };
  }, [form.rows, form.type]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateRow = (rowId, field, value) => {
    setForm((current) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
              ...(field === "tdsApplicable" && value === "No"
                ? { tdsType: "" }
                : {}),
            }
          : row
      ),
    }));
  };

  const addRow = () => {
    setForm((current) => ({ ...current, rows: [...current.rows, blankRow()] }));
  };

  const removeRow = (rowId) => {
    setForm((current) => ({
      ...current,
      rows:
        current.rows.length === 1
          ? current.rows
          : current.rows.filter((row) => row.id !== rowId),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.date || !form.type || !form.narration.trim()) {
      setError("Date, voucher type, and narration are required.");
      return;
    }

    const invalidRow = form.rows.some(
      (row) => !row.account || Number(row.amount || 0) <= 0
    );

    if (invalidRow) {
      setError("Each row must include an account head and amount.");
      return;
    }

    onSubmit({
      ...form,
      totalDebit: totals.debit,
      totalCredit: totals.credit,
      rows: form.rows.map((row) => ({
        ...row,
        amount: Number(row.amount),
      })),
    });

    if (!voucher) {
      setForm(initialForm);
    }
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-300 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white"
          >
            Show All
          </button>
          <button
            type="button"
            className="rounded bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
          >
            Add New Voucher
          </button>
          <button
            type="button"
            className="rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white"
          >
            Create Account
          </button>
        </div>
        <div className="text-sm font-semibold text-slate-800">
          Voucher Entry | Create
        </div>
        <button
          type="submit"
          className="rounded bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
        >
          {submitLabel}
        </button>
      </div>

      <div className="grid gap-4 p-4">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-3 text-xs md:grid-cols-7">
          <label className="grid gap-1 font-medium text-slate-700">
            Group
            <input
              value={form.group}
              onChange={(event) => updateField("group", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Voucher No
            <input
              value={form.voucherNo}
              onChange={(event) => updateField("voucherNo", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
              placeholder="Auto"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Voc Type
            <select
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
            >
              <option>Payment</option>
              <option>Received</option>
            </select>
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Remarks
            <input
              value={form.remarks}
              onChange={(event) => updateField("remarks", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700 md:col-span-2">
            Account Head
            <select
              value={form.accountHead}
              onChange={(event) => updateField("accountHead", event.target.value)}
              className="rounded border border-slate-300 px-2 py-2"
            >
              <option value="">Select Account Head</option>
              {accountOptions.map((account) => (
                <option key={account}>{account}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-xs">
            <thead className="bg-indigo-300 text-slate-900">
              <tr>
                <th className="px-2 py-3">Account Head</th>
                <th className="px-2 py-3">Narration</th>
                <th className="px-2 py-3">Bill No</th>
                <th className="px-2 py-3">Amt</th>
                <th className="px-2 py-3">Mode</th>
                <th className="px-2 py-3">Reference No</th>
                <th className="px-2 py-3">Voc Type</th>
                <th className="px-2 py-3">TDS</th>
                <th className="px-2 py-3">TDS Type</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {form.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2">
                    <select
                      value={row.account}
                      onChange={(event) =>
                        updateRow(row.id, "account", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    >
                      <option value="">Select Account Head</option>
                      {accountOptions.map((account) => (
                        <option key={account}>{account}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={form.narration}
                      onFocus={() =>
                        form.narration === "On Account" &&
                        updateField("narration", "")
                      }
                      onChange={(event) =>
                        updateField("narration", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.billNo}
                      onChange={(event) =>
                        updateRow(row.id, "billNo", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="1"
                      value={row.amount}
                      onChange={(event) =>
                        updateRow(row.id, "amount", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={row.mode}
                      onChange={(event) =>
                        updateRow(row.id, "mode", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    >
                      <option>NA</option>
                      <option>Cash</option>
                      <option>Bank</option>
                      <option>Cheque</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={row.referenceNo}
                      onChange={(event) =>
                        updateRow(row.id, "referenceNo", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    />
                  </td>
                  <td className="p-2 text-center font-semibold text-slate-700">
                    {form.type}
                  </td>
                  <td className="p-2">
                    <select
                      value={row.tdsApplicable}
                      onChange={(event) =>
                        updateRow(row.id, "tdsApplicable", event.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-2"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </td>
                  <td className="p-2">
                    {row.tdsApplicable === "Yes" ? (
                      <select
                        value={row.tdsType}
                        onChange={(event) =>
                          updateRow(row.id, "tdsType", event.target.value)
                        }
                        className="w-full rounded border border-slate-300 px-2 py-2"
                      >
                        <option value="">Select</option>
                        <option>Professional</option>
                        <option>Contractor</option>
                        <option>Rent</option>
                      </select>
                    ) : (
                      <span className="block rounded border border-slate-200 bg-slate-100 px-2 py-2 text-slate-400">
                        NA
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={addRow}
                        className="h-8 w-8 rounded bg-sky-500 text-lg font-bold text-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="h-8 w-8 rounded bg-red-500 text-lg font-bold text-white"
                      >
                        x
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 text-xs md:grid-cols-4">
          <label className="grid gap-1 font-medium text-slate-700">
            Total DR Amt
            <input
              readOnly
              value={totals.debit}
              className="rounded border border-slate-300 bg-slate-50 px-2 py-2"
            />
          </label>
          <label className="grid gap-1 font-medium text-slate-700">
            Total CR Amt
            <input
              readOnly
              value={totals.credit}
              className="rounded border border-slate-300 bg-slate-50 px-2 py-2"
            />
          </label>
          <div className="flex items-end text-xs font-medium text-slate-500 md:col-span-2">
            Bill Ref Module Totals
          </div>
        </div>

        {onCancel && (
          <div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

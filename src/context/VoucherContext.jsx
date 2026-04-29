import { createContext, useContext, useMemo, useState } from "react";

const VoucherContext = createContext(null);

const STORAGE_KEY = "voucher_app_vouchers";

const seedVouchers = [
  {
    id: "VCH-1001",
    voucherNo: "1",
    group: "CASH",
    date: "2026-04-29",
    type: "Payment",
    narration: "Office stationery purchase",
    remarks: "Monthly supplies",
    accountHead: "Cash Account",
    rows: [
      {
        id: "ROW-1",
        account: "Office Expense",
        amount: 2450,
        tdsApplicable: "No",
        tdsType: "",
        billNo: "B-101",
        mode: "Cash",
        referenceNo: "",
      },
    ],
    totalDebit: 2450,
    totalCredit: 0,
  },
  {
    id: "VCH-1002",
    voucherNo: "2",
    group: "CASH",
    date: "2026-04-29",
    type: "Received",
    narration: "Client payment received",
    remarks: "Advance payment",
    accountHead: "Bank Account",
    rows: [
      {
        id: "ROW-2",
        account: "Sales Account",
        amount: 18000,
        tdsApplicable: "Yes",
        tdsType: "Professional",
        billNo: "INV-44",
        mode: "Bank",
        referenceNo: "NEFT-881",
      },
    ],
    totalDebit: 0,
    totalCredit: 18000,
  },
];

function getInitialVouchers() {
  const savedVouchers = localStorage.getItem(STORAGE_KEY);
  return savedVouchers ? JSON.parse(savedVouchers).map(normalizeVoucher) : seedVouchers;
}

function saveVouchers(vouchers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
}

function withTotals(voucher) {
  const total = voucher.rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  return {
    ...voucher,
    totalDebit: voucher.type === "Payment" ? total : 0,
    totalCredit: voucher.type === "Received" ? total : 0,
  };
}

function normalizeVoucher(voucher, index) {
  if (voucher.rows?.length) {
    return withTotals(voucher);
  }

  const type = voucher.type === "Income" ? "Received" : "Payment";
  return withTotals({
    id: voucher.id ?? `VCH-${1000 + index}`,
    voucherNo: voucher.voucherNo ?? String(index + 1),
    group: voucher.group ?? "CASH",
    date: voucher.date ?? new Date().toISOString().slice(0, 10),
    type,
    narration: voucher.narration ?? voucher.title ?? "On Account",
    remarks: voucher.remarks ?? "",
    accountHead: voucher.accountHead ?? "",
    rows: [
      {
        id: `ROW-${voucher.id ?? index}`,
        account: voucher.accountHead ?? "Cash Account",
        amount: Number(voucher.amount || voucher.totalDebit || voucher.totalCredit || 0),
        tdsApplicable: "No",
        tdsType: "",
        billNo: "",
        mode: "NA",
        referenceNo: "",
      },
    ],
  });
}

export function VoucherProvider({ children }) {
  const [vouchers, setVouchers] = useState(getInitialVouchers);

  const createVoucher = (voucher) => {
    const nextVoucher = withTotals({
      ...voucher,
      id: `VCH-${Date.now().toString().slice(-6)}`,
      voucherNo: String(vouchers.length + 1),
    });

    setVouchers((current) => {
      const next = [nextVoucher, ...current];
      saveVouchers(next);
      return next;
    });

    return nextVoucher;
  };

  const updateVoucher = (id, updates) => {
    setVouchers((current) => {
      const next = current.map((voucher) =>
        voucher.id === id ? withTotals({ ...voucher, ...updates }) : voucher
      );
      saveVouchers(next);
      return next;
    });
  };

  const deleteVoucher = (id) => {
    setVouchers((current) => {
      const next = current.filter((voucher) => voucher.id !== id);
      saveVouchers(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      vouchers,
      createVoucher,
      updateVoucher,
      deleteVoucher,
    }),
    [vouchers]
  );

  return (
    <VoucherContext.Provider value={value}>{children}</VoucherContext.Provider>
  );
}

export function useVouchers() {
  const context = useContext(VoucherContext);

  if (!context) {
    throw new Error("useVouchers must be used within a VoucherProvider.");
  }

  return context;
}

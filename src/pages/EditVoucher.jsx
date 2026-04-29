import VoucherForm from "../components/VoucherForm";
import { useVouchers } from "../context/VoucherContext";

export default function EditVoucher({ voucherId, onCancel, onSaved }) {
  const { vouchers, updateVoucher } = useVouchers();
  const voucher = vouchers.find((item) => item.id === voucherId);

  if (!voucher) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">
          Voucher not found.
        </div>
      </section>
    );
  }

  const handleSubmit = (updates) => {
    updateVoucher(voucher.id, updates);
    onSaved();
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-950">
          Edit Voucher
        </h2>
        <p className="mt-1 text-sm text-slate-500">{voucher.id}</p>
      </div>

      <VoucherForm
        voucher={voucher}
        submitLabel="Update Voucher"
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </section>
  );
}

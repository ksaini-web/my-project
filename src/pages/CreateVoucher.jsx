import VoucherForm from "../components/VoucherForm";
import { useVouchers } from "../context/VoucherContext";

export default function CreateVoucher({ onCreated }) {
  const { createVoucher } = useVouchers();

  const handleSubmit = (voucher) => {
    createVoucher(voucher);
    onCreated();
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-950">
          Create Voucher
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a new income or expense voucher.
        </p>
      </div>

      <VoucherForm onSubmit={handleSubmit} />
    </section>
  );
}

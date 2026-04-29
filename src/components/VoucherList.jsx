import { useVoucher } from "../context/VoucherContext";
import { useAuth } from "../context/AuthContext";

function VoucherList() {
  const { vouchers, deleteVoucher } = useVoucher();
  const { user } = useAuth();

  return (
    <div>
      <h2>Voucher List</h2>

      {/* Filters */}
      <input placeholder="Search Narration..." />

      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Narration</th>
            <th>Debit</th>
            <th>Credit</th>
            {user.role === "admin" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id}>
              <td>{v.date}</td>
              <td>{v.type}</td>
              <td>{v.narration}</td>
              <td>{v.debit}</td>
              <td>{v.credit}</td>

              {user.role === "admin" && (
                <td>
                  <button>Edit</button>
                  <button onClick={() => deleteVoucher(v.id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VoucherList;
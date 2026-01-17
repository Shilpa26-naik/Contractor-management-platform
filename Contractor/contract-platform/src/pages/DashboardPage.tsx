import { useState } from "react";
import { useContracts } from "../context/ContractContext";

type Status =
  | "CREATED"
  | "APPROVED"
  | "SENT"
  | "SIGNED"
  | "LOCKED"
  | "REVOKED";

export default function DashboardPage() {
  const { contracts, updateStatus } = useContracts();

  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "ACTIVE" | "SIGNED"
  >("ALL");

  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const nextStatus: Record<Status, Status | null> = {
    CREATED: "APPROVED",
    APPROVED: "SENT",
    SENT: "SIGNED",
    SIGNED: "LOCKED",
    LOCKED: null,
    REVOKED: null,
  };

  const canRevoke = (status: Status) =>
    status === "CREATED" || status === "SENT";

  const canEdit = (status: Status) =>
    !["LOCKED", "REVOKED"].includes(status);

  const statusColor = (status: Status) => {
    switch (status) {
      case "CREATED":
        return "#64748b";
      case "APPROVED":
        return "#2563eb";
      case "SENT":
        return "#d97706";
      case "SIGNED":
        return "#16a34a";
      case "LOCKED":
        return "#020617";
      case "REVOKED":
        return "#dc2626";
      default:
        return "#000";
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (filter === "PENDING")
      return ["CREATED", "APPROVED", "SENT"].includes(c.status);
    if (filter === "ACTIVE")
      return ["APPROVED", "SENT"].includes(c.status);
    if (filter === "SIGNED")
      return ["SIGNED", "LOCKED"].includes(c.status);
    return true;
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setSelectedContract({
      ...selectedContract,
      fields: selectedContract.fields.map((f: any) =>
        f.id === fieldId ? { ...f, value } : f
      ),
    });
  };

  const saveEdits = () => {
    updateContractFields(selectedContract.id, selectedContract.fields);
    setIsEditMode(false);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Contracts Dashboard</h2>

      {/* Filters */}
      <div style={styles.filters}>
        {["ALL", "PENDING", "ACTIVE", "SIGNED"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            style={{
              ...styles.filterBtn,
              background: filter === f ? "#2563eb" : "#e5e7eb",
              color: filter === f ? "#fff" : "#000",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Contract Name</th>
              <th>Blueprint</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredContracts.map(contract => (
              <tr key={contract.id}>
                <td>{contract.name}</td>
                <td>{contract.blueprintName}</td>

                <td>
                  <span
                    style={{
                      ...styles.status,
                      color: statusColor(contract.status),
                      borderColor: statusColor(contract.status),
                    }}
                  >
                    {contract.status}
                  </span>
                </td>

                <td>
                  {new Date(contract.createdAt).toLocaleDateString()}
                </td>

                <td style={styles.actions}>
                  <button
                    style={styles.viewBtn}
                    onClick={() => {
                      setSelectedContract(contract);
                      setIsEditMode(false);
                    }}
                  >
                    View
                  </button>

                  {canEdit(contract.status) && (
                    <button
                      style={styles.editBtn}
                      onClick={() => {
                        setSelectedContract(contract);
                        setIsEditMode(true);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {nextStatus[contract.status] && (
                    <button
                      style={styles.actionBtn}
                      onClick={() =>
                        updateStatus(
                          contract.id,
                          nextStatus[contract.status]!
                        )
                      }
                    >
                      Move to {nextStatus[contract.status]}
                    </button>
                  )}

                  {canRevoke(contract.status) && (
                    <button
                      style={styles.revokeBtn}
                      onClick={() =>
                        updateStatus(contract.id, "REVOKED")
                      }
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedContract && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>
              {isEditMode ? "Edit Contract" : "Contract Details"}
            </h3>

            <p><b>Name:</b> {selectedContract.name}</p>
            <p><b>Status:</b> {selectedContract.status}</p>

            <h4>Fields</h4>

            {selectedContract.fields.map((f: any) => (
              <div key={f.id} style={styles.field}>
                <label>{f.label}</label>
                {isEditMode ? (
                  <input
                    style={styles.input}
                    value={f.value || ""}
                    onChange={e =>
                      handleFieldChange(f.id, e.target.value)
                    }
                  />
                ) : (
                  <p>{f.value || "-"}</p>
                )}
              </div>
            ))}

            {isEditMode && (
              <button style={styles.saveBtn} onClick={saveEdits}>
                Save
              </button>
            )}

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedContract(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  page: { padding: "40px", background: "#f8fafc" },
  title: { fontSize: "22px", marginBottom: "16px" },
  filters: { display: "flex", gap: "10px", marginBottom: "20px" },
  filterBtn: { padding: "6px 14px", borderRadius: "999px", border: "none" },
  tableWrapper: { background: "#fff", borderRadius: "10px" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  status: { padding: "4px 10px", border: "1px solid", borderRadius: "999px" },
  actions: { display: "flex", gap: "6px", flexWrap: "wrap" as const },
  viewBtn: { padding: "6px 10px" },
  editBtn: { padding: "6px 10px", background: "#22c55e", color: "#fff" },
  actionBtn: { padding: "6px 10px", background: "#2563eb", color: "#fff" },
  revokeBtn: { padding: "6px 10px", background: "#dc2626", color: "#fff" },

  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { background: "#fff", padding: "20px", borderRadius: "10px" },
  field: { marginBottom: "10px" },
  input: { width: "100%", padding: "6px" },
  saveBtn: { background: "#16a34a", color: "#fff", padding: "6px 12px" },
  closeBtn: { marginTop: "10px" },
};
function updateContractFields(id: any, fields: any) {
    throw new Error("Function not implemented.");
}


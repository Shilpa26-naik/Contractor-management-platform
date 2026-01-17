import { useState } from "react";
import { useBlueprints } from "../context/BlueprintContext";
import { useContracts } from "../context/ContractContext";
import type { Contract } from "../models/Contract";
import type { Field } from "../models/Field";

export default function ContractPage() {
  const { blueprints } = useBlueprints();
  const { addContract } = useContracts();

  const [selected, setSelected] = useState("");
  const [fields, setFields] = useState<Field[]>([]);

  const handleBlueprintSelect = (id: string) => {
    setSelected(id);

    const blueprint = blueprints.find(b => b.id === id);
    if (!blueprint) return;

    // Clone fields and add empty values
    const contractFields = blueprint.fields.map(field => ({
      ...field,
      value: field.type === "CHECKBOX" ? false : "",
    }));

    setFields(contractFields);
  };

  const updateFieldValue = (id: string, value: any) => {
    setFields(prev =>
      prev.map(f => (f.id === id ? { ...f, value } : f))
    );
  };

  const createContract = () => {
    const blueprint = blueprints.find(b => b.id === selected);
    if (!blueprint) return;

    const newContract: Contract = {
      id: Date.now().toString(),
      name: `${blueprint.name} Contract`,
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      fields,
      status: "CREATED",
      createdAt: new Date().toISOString(),
    };

    addContract(newContract);
    setSelected("");
    setFields([]);
  };

  return (
    <div style={styles.container}>
      <h2>Create Contract</h2>

      {/* Select Blueprint */}
      <select
        value={selected}
        onChange={e => handleBlueprintSelect(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Blueprint</option>
        {blueprints.map(bp => (
          <option key={bp.id} value={bp.id}>
            {bp.name}
          </option>
        ))}
      </select>

      {/* Render Fields */}
      {fields.map(field => (
        <div key={field.id} style={styles.fieldRow}>
          <label>{field.label}</label>

          {field.type === "TEXT" && (
            <input
              value={field.value as string}
              onChange={e => updateFieldValue(field.id, e.target.value)}
            />
          )}

          {field.type === "DATE" && (
            <input
              type="date"
              value={field.value as string}
              onChange={e => updateFieldValue(field.id, e.target.value)}
            />
          )}

          {field.type === "SIGNATURE" && (
            <input
              placeholder="Type signature"
              value={field.value as string}
              onChange={e => updateFieldValue(field.id, e.target.value)}
            />
          )}

          {field.type === "CHECKBOX" && (
            <input
              type="checkbox"
              checked={field.value as boolean}
              onChange={e => updateFieldValue(field.id, e.target.checked)}
            />
          )}
        </div>
      ))}

      <button onClick={createContract} style={styles.button}>
        Create Contract
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    fontFamily: "Inter, sans-serif",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "12px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

import { useState } from "react";
import { useBlueprints } from "../context/BlueprintContext";
import type { Blueprint } from "../models/Blueprint";
import type { Field, FieldType } from "../models/Field";

export default function BlueprintPage() {
  const { blueprints, addBlueprint } = useBlueprints();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldType, setFieldType] = useState<FieldType>("TEXT");
  const [fieldLabel, setFieldLabel] = useState("");

  const addField = () => {
    if (!fieldLabel.trim()) return;

    const newField: Field = {
      id: crypto.randomUUID(),
      label: fieldLabel, // ✅ Label stored
      type: fieldType,   // ✅ Type stored
      position: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 80),
      },                 // ✅ Position stored
    };

    setFields(prev => [...prev, newField]);
    setFieldLabel("");
  };

  const createBlueprint = () => {
    if (!name.trim() || fields.length === 0) return;

    const newBlueprint: Blueprint = {
      id: crypto.randomUUID(),
      name,
      fields,
      createdAt: new Date().toISOString(),
    };

    addBlueprint(newBlueprint); // ✅ Stored in localStorage
    setName("");
    setFields([]);
  };

  return (
    <div style={styles.container}>
      <h2>Create Blueprint</h2>

      {/* Blueprint Name */}
      <input
        placeholder="Blueprint name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />

      {/* Field Creator */}
      <div style={styles.fieldRow}>
        <input
          placeholder="Field label"
          value={fieldLabel}
          onChange={e => setFieldLabel(e.target.value)}
          style={styles.input}
        />

        <select
          value={fieldType}
          onChange={e => setFieldType(e.target.value as FieldType)}
          style={styles.select}
        >
          <option value="TEXT">Text</option>
          <option value="DATE">Date</option>
          <option value="SIGNATURE">Signature</option>
          <option value="CHECKBOX">Checkbox</option>
        </select>

        <button onClick={addField} style={styles.secondaryBtn}>
          Add Field
        </button>
      </div>

      {/* Preview Area */}
      <div style={styles.preview}>
        <h4 style={{ textAlign: "center" }}>Blueprint Preview</h4>

        {fields.map(field => (
          <div
            key={field.id}
            style={{
              ...styles.fieldBox,
              left: field.position.x,
              top: field.position.y,
            }}
          >
            {field.label} ({field.type})
          </div>
        ))}
      </div>

      <button onClick={createBlueprint} style={styles.primaryBtn}>
        Save Blueprint
      </button>

      {/* Existing Blueprints */}
      <ul style={styles.list}>
        {blueprints.map(bp => (
          <li key={bp.id} style={styles.card}>
            <b>{bp.name}</b> — {bp.fields.length} fields
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Inter, sans-serif",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    flex: 1,
  },
  fieldRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
  },
  preview: {
    position: "relative" as const,
    height: "150px",
    border: "1px dashed #cbd5f5",
    borderRadius: "8px",
    marginTop: "20px",
    padding: "10px",
  },
  fieldBox: {
    position: "absolute" as const,
    padding: "6px 10px",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    background: "#eff6ff",
    fontSize: "12px",
  },
  primaryBtn: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "30px",
  },
  card: {
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginBottom: "10px",
    background: "#f9fafb",
  },
};

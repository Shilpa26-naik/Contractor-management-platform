export type FieldType = "TEXT" | "DATE" | "SIGNATURE" | "CHECKBOX";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  position: {
    x: number;
    y: number;
  };
  value?: string | boolean;

}

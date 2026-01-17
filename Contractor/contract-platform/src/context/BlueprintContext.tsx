import React, { createContext, useContext, useEffect, useState } from "react";
import type { Blueprint } from "../models/Blueprint";
import { storage } from "../utils/storage";

interface BlueprintContextType {
  blueprints: Blueprint[];
  addBlueprint: (bp: Blueprint) => void;
}

const BlueprintContext = createContext<BlueprintContextType | null>(null);

export const BlueprintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);

  // Load from localStorage
  useEffect(() => {
    setBlueprints(storage.get<Blueprint[]>("blueprints", []));
  }, []);

  // Save to localStorage
  useEffect(() => {
    storage.set("blueprints", blueprints);
  }, [blueprints]);

  const addBlueprint = (bp: Blueprint) => {
    setBlueprints(prev => [...prev, bp]);
  };

  return (
    <BlueprintContext.Provider value={{ blueprints, addBlueprint }}>
      {children}
    </BlueprintContext.Provider>
  );
};

export const useBlueprints = () => {
  const ctx = useContext(BlueprintContext);
  if (!ctx) throw new Error("useBlueprints must be used inside BlueprintProvider");
  return ctx;
};

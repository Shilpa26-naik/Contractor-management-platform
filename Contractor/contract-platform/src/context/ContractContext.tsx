import React, { createContext, useContext, useEffect, useState } from "react";
import type { Contract, ContractStatus } from "../models/Contract";
import { storage } from "../utils/storage";

interface ContractContextType {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  updateStatus: (id: string, status: ContractStatus) => void;
}

const ContractContext = createContext<ContractContextType | null>(null);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Load
  useEffect(() => {
    setContracts(storage.get<Contract[]>("contracts", []));
  }, []);

  // Save
  useEffect(() => {
    storage.set("contracts", contracts);
  }, [contracts]);

  const addContract = (contract: Contract) => {
    setContracts(prev => [...prev, contract]);
  };

  const updateStatus = (id: string, status: ContractStatus) => {
    setContracts(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, updateStatus }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error("useContracts must be used inside ContractProvider");
  return ctx;
};

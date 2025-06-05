"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CareInfo {
  [key: string]: any;
}

interface CareContextProps {
  care: CareInfo | null;
  setCare: (care: CareInfo) => void;
  clearCare: () => void;
}

const CareContext = createContext<CareContextProps | undefined>(undefined);

export const CareProvider = ({ children }: { children: ReactNode }) => {
  const [care, setCareState] = useState<CareInfo | null>(null);

  const setCare = (care: CareInfo) => {
    setCareState(care);
  };

  const clearCare = () => {
    setCareState(null);
  };

  return (
    <CareContext.Provider value={{ care, setCare, clearCare }}>
      {children}
    </CareContext.Provider>
  );
};

export const useCare = () => {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error("useCare must be used within a CareProvider");
  }
  return context;
};

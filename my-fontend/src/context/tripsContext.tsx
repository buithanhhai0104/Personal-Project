"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";
import { ITrips } from "@/types/trips";

interface TripsContextType {
  tripsData: ITrips[];
  setTripsData: (tripsData: ITrips[]) => void;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

interface TripsProviderProps {
  children: ReactNode;
}

export const TripsProvider: React.FC<TripsProviderProps> = ({ children }) => {
  const [tripsData, setTripsData] = useState<ITrips[]>([]);

  return (
    <TripsContext.Provider value={{ tripsData, setTripsData }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
};

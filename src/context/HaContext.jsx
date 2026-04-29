import { createContext, useContext, useState } from "react";

const HAContext = createContext();

export function HAProvider({ children }) {
  const [isHAConfigured, setIsHAConfigured] = useState(null);

  return (
    <HAContext.Provider value={{ isHAConfigured, setIsHAConfigured }}>
      {children}
    </HAContext.Provider>
  );
}

export function useHaConfiguration() {
  return useContext(HAContext);
}
import { createContext, useContext, useState } from "react";

const HAContext = createContext();

export function HAProvider({ children }) {
  const [isHAConfigured, setIsHAConfigured] = useState(null);
  const [configurationError, setConfigurationError] = useState(null);

  return (
    <HAContext.Provider value={{ isHAConfigured, setIsHAConfigured, configurationError, setConfigurationError }}>
      {children}
    </HAContext.Provider>
  );
}

export function useHaConfiguration() {
  return useContext(HAContext);
}
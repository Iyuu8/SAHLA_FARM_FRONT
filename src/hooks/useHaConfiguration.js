import { useState, useEffect } from "react";

export default function useHAConfiguration() {
  const [isHAConfigured, setIsHAConfigured] = useState(false);

  useEffect(() => {
    // Placeholder for actual HA configuration check logic
    // This could involve checking local storage, making an API call, etc.
    const haUrl = localStorage.getItem("haUrl");
    const haToken = localStorage.getItem("haToken");
    setIsHAConfigured(!!haUrl && !!haToken);
  }, []);

  return isHAConfigured;
}
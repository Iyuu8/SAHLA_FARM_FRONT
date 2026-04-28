import { useEffect, useMemo, useState } from "react";
import useFarmData from "./useFarmData";

export function useActuators() {
    const { farmData } = useFarmData();
    const [actuators, setActuators] = useState([]);

    useEffect(() => {
        if (farmData) {
            setActuators(farmData?.actuators || []); // Safely access actuators with optional chaining and provide a default empty array
        }
    }, [farmData]);
    return { actuators, setActuators }
}

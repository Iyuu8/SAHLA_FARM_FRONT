import { useEffect, useMemo, useState } from "react";
import useFarmData from "./useFarmData";

export default function useActuators() {
    const farmData = useFarmData();
    const [actuators, setActuators] = useState([]);

    useEffect(() => {
        if (farmData) {
            setActuators(farmData.actuators);
        }
    }, [farmData]);
    return { actuators, setActuators }
}

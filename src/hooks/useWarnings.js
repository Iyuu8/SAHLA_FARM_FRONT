import { useEffect, useState } from "react";
import useFarmData from "./useFarmData";

export function useWarnings() {
    const { farmData } = useFarmData();
    const [warnings, setWarnings] = useState(farmData?.warnings || []);

    useEffect(() => {
        if (farmData) {
            setWarnings(farmData.warnings);
        }
    }, [farmData]);

    return { warnings, setWarnings }
}
import { useState, useEffect } from "react";
import  useFarmData  from "./useFarmData";


export function useSensors() {
    const { farmData } = useFarmData();
    const [sensors, setSensors] = useState([]);
    useEffect(() => {
        // This effect will run whenever farmData changes, ensuring that the sensors state is always up-to-date with the latest farm data.
        setSensors(farmData?.sensors || []);
    }, [farmData]);
    
    
    return { sensors, setSensors }
}
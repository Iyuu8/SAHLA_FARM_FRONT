import { useState, useEffect } from "react";
import  useFarmData  from "./useFarmData";


export function useSensors() {
    const { farmData } = useFarmData();
    const [sensors, setSensors] = useState([]);
    useEffect(() => {
        
        setSensors(farmData?.sensors || []);
    }, [farmData]);
    
    
    return { sensors, setSensors }
}
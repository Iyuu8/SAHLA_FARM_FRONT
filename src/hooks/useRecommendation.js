import { useEffect, useState } from "react";
import useFarmData from "./useFarmData";


export function useRecommendation() {
    const { farmData } = useFarmData();
    const [recommendation, setRecommendation] = useState("Loading recommendation...");
    useEffect(() => {
        setRecommendation(farmData?.recommendation || "Loading recommendation...");
    }, [farmData]);
    
    return { recommendation, setRecommendation }
}   
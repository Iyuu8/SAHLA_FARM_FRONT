import { useState, useEffect } from "react"
import useFarmData  from "./useFarmData"
  
const useCropInfo = () => {
    const { farmData } = useFarmData();
    const [cropInfo, setCropInfo] = useState({
        crop: farmData?.crop?.type || "Loading...",
        growthStage: farmData?.crop?.growthStage || "Loading...",
        mode: farmData?.crop?.mode || "Loading..."
    });

    useEffect(() => {
        if (farmData) {
            setCropInfo({
                crop: farmData?.crop?.type || "Loading...",
                growthStage: farmData?.crop?.growth_stage || "Loading...",
                mode: farmData?.crop?.mode || "Loading..."
            });
        }
    }, [farmData]);




    return { ...cropInfo, setCropInfo };
}

export { useCropInfo } 


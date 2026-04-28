import { useState, useEffect } from "react"

export default function useFarmData() {
    const [farmData, setFarmData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/farm/freeStates")
            .then(res => res.json())
            .then(data => setFarmData(data))
            .catch(err => console.error("Error fetching farm data:", err));
    }, []);

    return { farmData, setFarmData };
}
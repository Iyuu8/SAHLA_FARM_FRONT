import { useState, useEffect } from "react"

export function useGraphData() {
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/farm/freeGraphData")
            .then(res => res.json())
            .then(data => setGraphData(data))
            .catch(err => console.error("Error fetching graph data:", err));
    }, []);

    return { graphData, setGraphData };
}
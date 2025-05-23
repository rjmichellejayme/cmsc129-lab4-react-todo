import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import db from "../firebase/db";

// Custom hook for retrieving and managing tasks
function useGetTasks() {
    // Loading state for initial data fetch
    const [isLoading, setIsLoading] = useState(true);
    // State to store tasks
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Get reference to tasks collection
        const tasksCollectionRef = collection(db, "tasks");
        // Create a query for all tasks
        const taskQuery = query(tasksCollectionRef);

        // Set up real-time listener for tasks
        const unsubscribe = onSnapshot(taskQuery, (res) => {
            // Transform Firestore documents to array of task objects
            const data = res.docs.map((doc) => doc.data());
            setTasks(data);
            setIsLoading(false);
        });

        // Cleanup function to unsubscribe from real-time updates
        return unsubscribe;
    }, []);

    // Return tasks and loading state
    return { isLoading, tasks };
}

export default useGetTasks;

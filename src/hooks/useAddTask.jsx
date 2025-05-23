import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import db from "../firebase/db";

// Custom hook for handling task operations (add/edit)
function usePostTask() {
    // Loading state for UI feedback
    const [isLoading, setIsLoading] = useState(false);

    // Function to add a new task to Firebase
    async function addTask(task) {
        try {
            setIsLoading(true);
            // Get reference to tasks collection
            const tasksCollectionRef = collection(db, "tasks");
            // Create a new document reference with auto-generated ID
            const taskDocRef = doc(tasksCollectionRef);

            // Prepare task data with additional metadata
            const taskData = {
                id: taskDocRef.id,          // Use Firebase's auto-generated ID
                dateAdded: new Date().toISOString(),  // Add creation timestamp
                checked: false,             // Initial completion state
                ...task,                    // Spread the provided task data
            };

            // Save task to Firebase
            await setDoc(taskDocRef, taskData);

            return { data: taskData, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: error };
        } finally {
            setIsLoading(false);
        }
    }

    // Function to edit an existing task
    async function editTask(id, task) {
        try {
            setIsLoading(true);
            // Get reference to tasks collection
            const tasksCollectionRef = collection(db, "tasks");
            // Get reference to specific task document
            const taskDocRef = doc(tasksCollectionRef, id);

            // Update task in Firebase
            await updateDoc(taskDocRef, task);

            return { data: task, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: error };
        } finally {
            setIsLoading(false);
        }
    }

    // Return functions and loading state
    return { addTask, editTask, isLoading };
}

export default usePostTask;

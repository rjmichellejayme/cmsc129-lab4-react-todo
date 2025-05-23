import { useState } from "react";
import Button from "./Button";
import clsx from "clsx";
import usePostTask from "../hooks/useAddTask";
import {
    delay,
    formatDate,
    formatTime,
    generateDateFromString,
} from "../utils/time";
import { toast } from "react-toastify";

// Default empty state for the form
const defaultEmptyState = {
    title: "",
    description: "",
    priority: "Mid",
    date: "",
    time: "",
};

function TaskForm({ initialData, isOpen, setIsOpen }) {
    // Custom hook for task operations (add/edit)
    const { isLoading, addTask, editTask } = usePostTask();
    
    // Form state management
    const [formData, setFormData] = useState({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        priority: initialData?.priority ?? "Mid",
        date: initialData ? formatDate(initialData.dueDate) : "",
        time: initialData ? formatTime(initialData.dueDate) : "",
    });

    // Handle input changes
    function handleChange(e, id) {
        const localFormData = { ...formData };
        localFormData[id] = e.target.value;
        setFormData(localFormData);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        const { title, description, priority, date, time } = formData;

        // Prepare task data for Firebase
        const taskData = {
            title,
            description,
            priority,
            dueDate: generateDateFromString(date, time).toISOString(),
        };

        // Show loading toast
        const toastId = toast.loading("Adding task...");
        let error = null;

        // Add or edit task based on initialData
        if (initialData) {
            error = (await editTask(initialData.id, taskData)).error;
        } else {
            error = (await addTask(taskData)).error;
        }

        // Handle success
        if (!error) {
            if (!initialData) {
                setFormData(defaultEmptyState);
            }
            toast.update(toastId, {
                render: `Task ${initialData ? "edited" : "added"}!`,
                type: "success",
                isLoading: false,
            });

            setIsOpen(false);
        } else {
            // Handle error
            toast.update(toastId, {
                render: "Something went wrong. Action did not went through.",
                type: "error",
                isLoading: false,
            });
        }

        // Dismiss toast after delay
        await delay(2000);
        toast.dismiss(toastId);
    }

    return (
        <section>
            {/* Modal backdrop with click-outside to close */}
            <div
                className={clsx(
                    "fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                    "transition-opacity duration-300"
                )}
                onClick={() => setIsOpen(false)}
            >
                {/* Modal content */}
                <div
                    className={clsx(
                        "bg-white rounded-lg shadow-lg p-6 w-full max-w-md",
                        isOpen ? "scale-100" : "scale-95",
                        "transition-transform duration-300"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-bold mb-4">
                        {initialData ? "Edit Task" : "Add Task"}
                    </h2>
                    {/* Task form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Title input */}
                        <input
                            required
                            className="rounded-lg p-3 outline-none border border-gray-300 focus:border-blue-500"
                            placeholder="Add Task"
                            id="title"
                            name="title"
                            onChange={(e) => handleChange(e, "title")}
                            disabled={isLoading}
                            value={formData.title}
                        />

                        {/* Priority selection */}
                        <section>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority:</label>
                            <select
                                required
                                name="priority"
                                id="priority"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                value={formData.priority}
                                disabled={isLoading}
                                onChange={(e) => handleChange(e, "priority")}
                            >
                                <option value="Low">Low</option>
                                <option value="Mid">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </section>

                        {/* Date and Time inputs */}
                        <section className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Choose a date:</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="date"
                                        id="date"
                                        name="date"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.date}
                                        disabled={isLoading}
                                        onChange={(e) => handleChange(e, "date")}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Choose a time:</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="time"
                                        id="time"
                                        name="time"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.time}
                                        disabled={isLoading}
                                        onChange={(e) => handleChange(e, "time")}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Form actions */}
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-600/70"
                                type="submit"
                                disabled={isLoading}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default TaskForm;

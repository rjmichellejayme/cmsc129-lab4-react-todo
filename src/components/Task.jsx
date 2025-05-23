import clsx from "clsx";
import PencilIcon from "../assets/icons/pencil.svg";
import TrashIcon from "../assets/icons/trash-2.svg";
import { getPriorityPillStyle } from "../utils/style";
import { memo, useState } from "react";
import db from "../firebase/db";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TaskForm from "./TaskForm";

// Helper function to get border color based on priority
function getPriorityBorderColor(priority) {
    switch (priority) {
        case "High":
            return "border-red-500";
        case "Medium":
            return "border-yellow-500";
        case "Low":
            return "border-green-500";
        default:
            return "border-yellow-300"; 
    }
}

// Component for the undo notification toast
function UndoNotification({ closeToast, data }) {
    function handleUndo() {
        data.onUndo();
        closeToast(true);
    }

    return (
        <div className="flex items-center w-full justify-between">
            <span>Task deleted</span>{" "}
            <button
                className="bg-black mr-2 px-2 py-1 rounded-md text-white text-xs cursor-pointer"
                onClick={handleUndo}
            >
                Undo
            </button>
        </div>
    );
}

function Task({ id, title, description, priority, dueDate, checked }) {
    // State for task completion
    const [checkState, setCheckState] = useState(checked);
    // State for task visibility (used for optimistic UI updates)
    const [isVisible, setIsVisible] = useState(true);
    // State for edit modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    // Reference to the task document in Firebase
    const taskDocRef = doc(db, "tasks", id);

    // Handle task completion toggle
    async function handleCheckState() {
        if (checkState) {
            setCheckState(false); // Optimistic UI update
            await updateDoc(taskDocRef, { checked: false });
        } else {
            setCheckState(true); // Optimistic UI update
            await updateDoc(taskDocRef, { checked: true });
        }
    }

    // Handle task deletion with confirmation and undo functionality
    async function handleDelete() {
        // Show confirmation dialog using SweetAlert2
        const { isConfirmed } = await Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this task?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#fb2c36",
        });

        // If user cancels, return early
        if (!isConfirmed) {
            return;
        }

        // Optimistically hide the task from UI
        setIsVisible(false);

        // Show toast notification with undo option
        toast.info(UndoNotification, {
            onClose: (removedByUser) => {
                // If toast was manually closed, don't delete the task
                if (removedByUser) {
                    return;
                }

                // Delete the task from Firebase
                deleteDoc(taskDocRef);
            },
            data: {
                // Function to restore task visibility if undo is clicked
                onUndo: () => setIsVisible(true),
            },
        });
    }

    // If task is not visible (deleted), don't render it
    if (!isVisible) return null;

    return (
        <li className="mb-4 rounded-lg shadow-md overflow-hidden">
            <div className={clsx("flex border-l-4", getPriorityBorderColor(priority))}>
                <div className="flex gap-2 flex-1 p-4">
                    {/* Task completion checkbox */}
                    <input
                        type="checkbox"
                        checked={checkState}
                        onChange={handleCheckState}
                    />
                    <div>
                        {/* <p className="text-gray-500 text-xs">
                            #{id.substring(0, 7)}...
                        </p> */}
                        <h2 className="font-bold text-lg">{title}</h2>
                        <p className="text-sm text-gray-700">{description}</p>
                        <p className="text-gray-500 text-xs mt-1">
                            {new Date(dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}{' '}
                            {new Date(dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </p>
                        {/* Keep priority pill for now, adjust styling later if needed */}
                        {/* <div
                            className={clsx(
                                "rounded-xl text-white w-fit px-2",
                                getPriorityPillStyle(priority),
                            )}
                        >
                            {priority}
                        </div> */}
                    </div>
                </div>

                {/* Task action buttons */}
                <div className="flex flex-col justify-center space-y-2 px-2">
                    {/* Edit button */}
                    <button
                        className="block cursor-pointer hover:scale-110 transition-all"
                        onClick={() => setIsEditOpen((prev) => !prev)}
                    >
                        <img className="w-5 h-5" src={PencilIcon} alt="edit" />
                    </button>
                    {/* Delete button */}
                    <button
                        className="block cursor-pointer hover:scale-110 transition-all"
                        onClick={handleDelete}
                    >
                        <img className="w-5 h-5" src={TrashIcon} alt="delete" />
                    </button>
                </div>
            </div>
            {/* Edit task form modal */}
            <TaskForm
                initialData={{
                    id,
                    title,
                    description,
                    priority,
                    dueDate,
                }}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
            />
        </li>
    );
}

export default memo(Task);

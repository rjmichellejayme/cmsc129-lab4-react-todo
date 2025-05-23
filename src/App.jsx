import { ToastContainer } from "react-toastify";
import FormTask from "./components/TaskForm";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Button from "./components/Button";
import { BsPlusLg } from "react-icons/bs";

function App() {
    // State to control the visibility of the new task form modal
    const [isNewTaskFormOpen, setIsNewTaskFormOpen] = useState(false);

    return (
        <>
            <div className="p-5 flex flex-col items-center">
                <div className="w-full max-w-[670px] bg-white p-6 rounded-lg shadow-md">
                    <Header />
                    
                    <main className="w-full space-y-3">
                        {/* Floating action button to trigger new task form */}
                        <Button
                            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setIsNewTaskFormOpen((prev) => !prev)}
                        >
                            <BsPlusLg size={24} />
                        </Button>
                        {/* Task form modal - controlled by isNewTaskFormOpen state */}
                        <FormTask
                            isOpen={isNewTaskFormOpen}
                            setIsOpen={setIsNewTaskFormOpen}
                        />
                        {/* Task list component that displays all tasks */}
                        <TaskList />
                    </main>
                </div>
            </div>
            {/* Toast notifications container for user feedback */}
            <ToastContainer position="bottom-right" />
        </>
    );
}

export default App;

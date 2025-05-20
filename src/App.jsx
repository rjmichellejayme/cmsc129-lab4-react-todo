import { ToastContainer } from "react-toastify";
import FormTask from "./components/TaskForm";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Button from "./components/Button";
import { BsPlusLg } from "react-icons/bs";

function App() {
    const [isNewTaskFormOpen, setIsNewTaskFormOpen] = useState(false);

    return (
        <>
            <div className="p-5">
                <Header />
                <main className="w-full space-y-3 max-w-[670px]">
                    <Button
                        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setIsNewTaskFormOpen((prev) => !prev)}
                    >
                        <BsPlusLg size={24} />
                    </Button>
                    <FormTask
                        isOpen={isNewTaskFormOpen}
                        setIsOpen={setIsNewTaskFormOpen}
                    />
                    <TaskList />
                </main>
            </div>
            <ToastContainer position="bottom-right" />
        </>
    );
}

export default App;

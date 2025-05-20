import { useState } from "react";
import useGetTasks from "../hooks/useGetTasks";
import Task from "./Task";
import { sortTasks } from "../utils/sort";

function TaskList() {
    const { tasks, isLoading } = useGetTasks();
    const [sortBy, setSortBy] = useState("DateAdded+");
    const sortedTasks = sortTasks(tasks, sortBy);

    function handleChangeSort(e) {
        setSortBy(e.target.value);
    }

    const hasNoTasks = !isLoading && tasks.length < 1;

    return (
        <>
            <section className="flex gap-2 items-center text-sm">
                <p>Sort by:</p>
                <select
                    name="sortBy"
                    id="sortBy"
                    className="p-2 border rounded-lg ml-1"
                    value={sortBy}
                    onChange={(e) => handleChangeSort(e)}
                >
                    <option value="DateAdded+">Date Added</option>
                    <option value="DueDate+">Due Date</option>
                    <option value="Priority+">Priority</option>
                </select>
            </section>
            <section>
                {isLoading && <p>Loading...</p>}
                {hasNoTasks && <p>No tasks!</p>}

                <ul>
                    {sortedTasks.map((data) => (
                        <Task key={data.id} {...data} />
                    ))}
                </ul>
            </section>
        </>
    );
}

export default TaskList;

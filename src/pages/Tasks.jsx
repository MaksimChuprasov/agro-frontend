import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [fields, setFields] = useState([]);
    const [users, setUsers] = useState([]);


    const [form, setForm] = useState({
        task_title: "",
        description: "",
        field_id: "",
        assigned_to: "",
        priority: "Medium",
        status: "Pending",
        due_date: ''
    });

    useEffect(() => {
        api.get("/tasks")
            .then(res => setTasks(res.data))
            .catch(err => console.log(err));

        api.get("/fields")
            .then(res => setFields(res.data))
            .catch(err => console.log(err));

        api.get("/users")
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    const saveTask = async () => {
        try {
            const payload = {
                ...form,
                field_id: Number(form.field_id),
                assigned_to: Number(form.assigned_to)
            };

            if (editId) {
                await api.put(`/tasks/${editId}`, payload);
            } else {
                await api.post("/tasks", payload);
            }

            const res = await api.get("/tasks");
            setTasks(res.data);

            setIsOpen(false);
            setEditId(null);

            setForm({
                task_title: "",
                description: "",
                field_id: "",
                assigned_to: "",
                priority: "Medium",
                status: "Pending",
                due_date: ""
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setEditId(null);
                        setForm({
                            title: "",
                            description: "",
                            field_id: "",
                            due_date: "",
                            status: ""
                        });
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Task
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Field</th>
                                <th className="p-3">Assigned</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Due</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.task_id} className="border-t">

                                    <td className="p-3">{task.task_title}</td>
                                    <td className="p-3">{task.field_id}</td>
                                    <td className="p-3">{task.assigned_to}</td>
                                    <td className="p-3">{task.priority}</td>

                                    <td className="p-3">
                                        {new Date(task.due_date).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                                            {task.status}
                                        </span>
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setEditId(task.task_id);
                                                setForm(task);
                                            }}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={async () => {
                                                await api.delete(`/tasks/${task.task_id}`);
                                                const res = await api.get("/tasks");
                                                setTasks(res.data);
                                            }}
                                            className="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white w-[420px] p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Task" : "Create Task"}
                        </h2>

                        <div className="flex flex-col gap-3">

                            <input
                                className="border p-2 rounded"
                                placeholder="Task title"
                                value={form.task_title}
                                onChange={(e) => setForm({ ...form, task_title: e.target.value })}
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                            <select
                                className="border p-2 rounded"
                                value={form.field_id}
                                onChange={(e) => setForm({ ...form, field_id: Number(e.target.value) })}
                            >
                                <option value="">Select field</option>
                                {fields.map(f => (
                                    <option key={f.field_id} value={f.field_id}>
                                        Field #{f.field_id}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="border p-2 rounded"
                                value={form.assigned_to}
                                onChange={(e) => setForm({ ...form, assigned_to: Number(e.target.value) })}
                            >
                                <option value="">Assign to</option>
                                {users.map(u => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="border p-2 rounded"
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <select
                                className="border p-2 rounded"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <input
                                className="border p-2 rounded"
                                type="date"
                                value={form.due_date}
                                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            />

                        </div>
                        <div className="flex justify-end gap-2 mt-5">

                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveTask}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                {editId ? "Update" : "Save"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
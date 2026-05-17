import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Irrigation() {
    const [irrigations, setIrrigations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        field_id: "",
        scheduled_time: "",
        duration_minutes: "",
        water_amount_liters: "",
        mode: "Manual",
        status: "Scheduled",
        created_by: 1
    });

    const saveIrrigation = async () => {
        try {
            const payload = {
                ...form,
                field_id: Number(form.field_id),
                duration_minutes: Number(form.duration_minutes),
                water_amount_liters: Number(form.water_amount_liters),
                created_by: 1
            };

            if (editId) {
                await api.put(`/irrigation/${editId}`, payload);
            } else {
                await api.post("/irrigation", payload);
            }

            fetchData();
            setIsOpen(false);
            setEditId(null);

            setForm({
                field_id: "",
                scheduled_time: "",
                duration_minutes: "",
                water_amount_liters: "",
                mode: "Manual",
                status: "Scheduled",
                created_by: 1
            });

        } catch (err) {
            console.log(err);
        }
    };

    const fetchData = async () => {
        try {
            const res = await api.get("/irrigation");
            setIrrigations(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Irrigation</h1>

                <button
                    onClick={() => {
                        setIsOpen(true);
                        setEditId(null);
                        setForm({
                            field_id: "",
                            schedule_time: "",
                            water_amount: "",
                            status: ""
                        });
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Irrigation
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Field</th>
                                <th className="p-3">Scheduled Time</th>
                                <th className="p-3">Duration (min)</th>
                                <th className="p-3">Water (L)</th>
                                <th className="p-3">Mode</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {irrigations.map(item => (
                                <tr key={item.irrigation_id} className="border-t">

                                    <td className="p-3">{item.field_id}</td>

                                    <td className="p-3">
                                        {new Date(item.scheduled_time).toLocaleString()}
                                    </td>

                                    <td className="p-3">{item.duration_minutes}</td>

                                    <td className="p-3">{item.water_amount_liters}</td>

                                    <td className="p-3">{item.mode}</td>

                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-3 flex gap-2">

                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setEditId(item.irrigation_id);
                                                setForm(item);
                                            }}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={async () => {
                                                await api.delete(`/irrigation/${item.irrigation_id}`);
                                                fetchData();
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

                {isOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                        <div className="bg-white w-[420px] p-6 rounded-xl">

                            <h2 className="text-xl font-bold mb-4">
                                {editId ? "Edit Irrigation" : "Create Irrigation"}
                            </h2>

                            <div className="flex flex-col gap-3">

                                <input
                                    className="border p-2 rounded"
                                    placeholder="Field ID"
                                    value={form.field_id}
                                    onChange={(e) => setForm({ ...form, field_id: e.target.value })}
                                />

                                <input
                                    className="border p-2 rounded"
                                    type="datetime-local"
                                    value={form.scheduled_time}
                                    onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
                                />

                                <input
                                    className="border p-2 rounded"
                                    placeholder="Duration (minutes)"
                                    value={form.duration_minutes}
                                    onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                                />

                                <input
                                    className="border p-2 rounded"
                                    placeholder="Water amount (liters)"
                                    value={form.water_amount_liters}
                                    onChange={(e) => setForm({ ...form, water_amount_liters: e.target.value })}
                                />

                                <select
                                    className="border p-2 rounded"
                                    value={form.mode}
                                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                                >
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>

                                <select
                                    className="border p-2 rounded"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                            </div>

                            <div className="flex justify-end gap-2 mt-5">

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveIrrigation}
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    {editId ? "Update" : "Save"}
                                </button>

                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
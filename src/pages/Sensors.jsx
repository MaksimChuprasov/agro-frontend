import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Sensors() {
    const [sensors, setSensors] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        field_id: "",
        sensor_type: "",
        status: ""
    });

    const fetchSensors = async () => {
        try {
            const res = await api.get("/sensors");
            setSensors(res.data);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/sensors");
                setSensors(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        load();
    }, []);

    const saveSensor = async () => {
        try {
            const payload = {
                ...form,
                field_id: Number(form.field_id)
            };

            if (editId) {
                await api.put(`/sensors/${editId}`, payload);
            } else {
                await api.post("/sensors", payload);
            }

            setIsOpen(false);
            setEditId(null);
            setForm({ field_id: "", sensor_type: "", status: "" });

            fetchSensors();
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const openEdit = (sensor) => {
        setEditId(sensor.sensor_id);

        setForm({
            field_id: sensor.field_id,
            sensor_type: sensor.sensor_type,
            status: sensor.status
        });

        setIsOpen(true);
    };

    const deleteSensor = async (id) => {
        try {
            await api.delete(`/sensors/${id}`);
            fetchSensors();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sensors</h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Sensor
                </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Field</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sensors.map(sensor => (
                                <tr key={sensor.sensor_id} className="border-t">
                                    <td className="p-3">{sensor.sensor_id}</td>
                                    <td className="p-3">{sensor.field_id}</td>
                                    <td className="p-3">{sensor.sensor_type}</td>

                                    <td className="p-3">
                                        <span className={
                                            sensor.status === "Online"
                                                ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                                                : "bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                                        }>
                                            {sensor.status}
                                        </span>
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => openEdit(sensor)}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition" j
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteSensor(sensor.sensor_id)}
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
                    <div className="bg-white w-[400px] p-6 rounded-xl">

                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Sensor" : "Create Sensor"}
                        </h2>

                        <div className="flex flex-col gap-3">

                            <input
                                className="border p-2 rounded"
                                placeholder="Field ID"
                                value={form.field_id}
                                onChange={(e) =>
                                    setForm({ ...form, field_id: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Sensor type"
                                value={form.sensor_type}
                                onChange={(e) =>
                                    setForm({ ...form, sensor_type: e.target.value })
                                }
                            />

                            <select
                                className="border p-2 rounded"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                            >
                                <option value="">Status</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                                <option value="Maintenance">Maintenance</option>
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
                                onClick={saveSensor}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                {editId ? "Update" : "Save"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Crops() {
    const [crops, setCrops] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        field_id: "",
        crop_name: "",
        planting_date: "",
        expected_harvest_date: "",
        growth_stage: "",
        water_requirement_mm: "",
        status: ""
    });

    useEffect(() => {
        console.log()
        api.get("/crops")
            .then(res => setCrops(res.data))
            .catch(err => console.log(err));
    }, []);

    const saveCrop = async () => {
        try {
            const payload = {
                ...form,
                field_id: Number(form.field_id),
                water_requirement_mm: Number(form.water_requirement_mm),
                status: form.status?.trim() || "Active"
            };

            if (editId) {
                await api.put(`/crops/${editId}`, payload);
            } else {
                await api.post("/crops", payload);
            }

            const res = await api.get("/crops");

            setCrops(res.data);

            setIsOpen(false);
            setEditId(null);

        } catch (err) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("MESSAGE:", err.message);
        }
    };

    const openEdit = (crop) => {
        setEditId(crop.crop_id || crop.id);

        setForm({
            field_id: crop.field_id,
            crop_name: crop.crop_name,
            planting_date: crop.planting_date,
            expected_harvest_date: crop.expected_harvest_date,
            growth_stage: crop.growth_stage,
            water_requirement_mm: crop.water_requirement_mm,
            status: crop.status
        });

        setIsOpen(true);
    };

    const deleteCrop = async (id) => {
        await api.delete(`/crops/${id}`);

        const res = await api.get("/crops");
        setCrops(res.data);
    };

    return (
        <div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Crops</h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Crop
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Field</th>
                                <th className="p-3">Planting</th>
                                <th className="p-3">Harvest</th>
                                <th className="p-3">Stage</th>
                                <th className="p-3">Water</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {crops.map(crop => (
                                <tr key={crop.crop_id || crop.id} className="border-t">

                                    <td className="p-3">{crop.crop_name}</td>
                                    <td className="p-3">{crop.field_id}</td>
                                    <td className="p-3">{crop.planting_date}</td>
                                    <td className="p-3">{crop.expected_harvest_date}</td>
                                    <td className="p-3">{crop.growth_stage}</td>
                                    <td className="p-3">{crop.water_requirement_mm}</td>

                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                            {crop.status}
                                        </span>
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => openEdit(crop)}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteCrop(crop)}
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

                    <div className="bg-white w-[420px] p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold mb-4">
                            Create Crop
                        </h2>

                        <div className="flex flex-col gap-3">

                            <input
                                className="border p-2 rounded"
                                placeholder="Crop name"
                                value={form.crop_name}
                                onChange={(e) =>
                                    setForm({ ...form, crop_name: e.target.value })
                                }
                            />

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
                                type="date"
                                value={form.planting_date}
                                onChange={(e) =>
                                    setForm({ ...form, planting_date: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                type="date"
                                value={form.expected_harvest_date}
                                onChange={(e) =>
                                    setForm({ ...form, expected_harvest_date: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Growth stage"
                                value={form.growth_stage}
                                onChange={(e) =>
                                    setForm({ ...form, growth_stage: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Water requirement"
                                value={form.water_requirement_mm}
                                onChange={(e) =>
                                    setForm({ ...form, water_requirement_mm: e.target.value })
                                }
                            />
                            <select
                                className="border p-2 rounded"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                            >
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Harvested">Harvested</option>
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
                                onClick={saveCrop}
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
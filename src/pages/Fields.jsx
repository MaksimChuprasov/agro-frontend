import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Fields() {
    const [isOpen, setIsOpen] = useState(false);
    const [fields, setFields] = useState([]);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        field_name: "",
        location: "",
        area_hectares: "",
        soil_type: "",
        status: ""
    });

    useEffect(() => {
        api.get("/fields")
            .then(res => {
                console.log("FIELDS RESPONSE:", res.data);
                setFields(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const saveField = async () => {
        try {
            if (editId) {
                // EDIT MODE
                await api.put(`/fields/${editId}`, form);
            } else {
                // CREATE MODE
                await api.post("/fields", form);
            }

            const res = await api.get("/fields");
            setFields(res.data);

            setIsOpen(false);
            setEditId(null);

            setForm({
                field_name: "",
                location: "",
                area_hectares: ""
            });

        } catch (err) {
            console.log(err);
        }
    };

    const openEditModal = (field) => {
        setEditId(field.field_id);

        setForm({
            field_name: field.field_name,
            location: field.location,
            area_hectares: field.area_hectares,
            soil_type: field.soil_type,
            status: field.status
        });

        setIsOpen(true);
    };

    const deleteField = async (id) => {
        const confirmDelete = window.confirm("Delete this field?");

        if (!confirmDelete) return;

        try {
            await api.delete(`/fields/${id}`);

            const res = await api.get("/fields");
            setFields(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Fields</h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Field
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Area</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {fields.map(field => (
                                <tr key={field.field_id} className="border-t">

                                    <td className="p-3">{field.field_name}</td>
                                    <td className="p-3">{field.location}</td>
                                    <td className="p-3">{field.area_hectares}</td>

                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                            {field.status}
                                        </span>
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(field)}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteField(field.field_id)}
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

                    <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Field" : "Create Field"}
                        </h2>

                        {/* FORM */}
                        <div className="flex flex-col gap-3">

                            <input
                                className="border p-2 rounded"
                                placeholder="Field name"
                                value={form.field_name}
                                onChange={(e) =>
                                    setForm({ ...form, field_name: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Location"
                                value={form.location}
                                onChange={(e) =>
                                    setForm({ ...form, location: e.target.value })
                                }
                            />

                            <input
                                className="border p-2 rounded"
                                placeholder="Area hectares"
                                type="number"
                                value={form.area_hectares}
                                onChange={(e) =>
                                    setForm({ ...form, area_hectares: e.target.value })
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
                                <option value="Healthy">Healthy</option>
                                <option value="Needs Irrigation">Needs Irrigation</option>
                                <option value="Ready for Harvest">Ready for Harvest</option>
                            </select>

                        </div>

                        <div className="flex justify-end gap-2 mt-5">

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setEditId(null);
                                    setForm({
                                        field_name: "",
                                        location: "",
                                        area_hectares: ""
                                    });
                                }}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveField}
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
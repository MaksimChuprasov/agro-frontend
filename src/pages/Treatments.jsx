import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Treatments() {
    const [treatments, setTreatments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [fields, setFields] = useState([]);
    const [crops, setCrops] = useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        field_id: "",
        crop_id: "",
        treatment_type: "",
        material_used: "",
        quantity: "",
        unit: "",
        treatment_date: "",
        cost: "",
        responsible_user_id: ""
    });

    useEffect(() => {
        api.get("/treatments").then(res => setTreatments(res.data));

        api.get("/fields").then(res => setFields(res.data));
        api.get("/crops").then(res => setCrops(res.data));
        api.get("/users").then(res => setUsers(res.data));
    }, []);

    // FETCH helper (если захочешь позже)
    const fetchData = () => {
        api.get("/treatments")
            .then(res => setTreatments(res.data))
            .catch(err => console.log(err));
    };

    const saveTreatment = async () => {
        try {
            const payload = {
                ...form,
                field_id: Number(form.field_id),
                crop_id: Number(form.crop_id),
                quantity: Number(form.quantity),
                cost: Number(form.cost),
                responsible_user_id: Number(form.responsible_user_id)
            };

            if (editId) {
                await api.put(`/treatments/${editId}`, payload);
            } else {
                await api.post("/treatments", payload);
            }

            fetchData();
            setIsOpen(false);
            setEditId(null);

            setForm({
                field_id: "",
                crop_id: "",
                treatment_type: "",
                material_used: "",
                quantity: "",
                unit: "",
                treatment_date: "",
                cost: "",
                responsible_user_id: ""
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Treatments</h1>

                <button
                    onClick={() => {
                        setIsOpen(true);
                        setEditId(null);
                        setForm({
                            field_id: "",
                            treatment_type: "",
                            date: "",
                            cost: "",
                            notes: ""
                        });
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Treatment
                </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Field</th>
                                <th className="p-3">Crop</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Material</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Cost</th>
                                <th className="p-3">Responsible</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {treatments.map(item => (
                                <tr key={item.treatment_id} className="border-t">

                                    <td className="p-3">{item.field_id}</td>
                                    <td className="p-3">{item.crop_id}</td>

                                    <td className="p-3">{item.treatment_type}</td>
                                    <td className="p-3">{item.material_used}</td>

                                    <td className="p-3">
                                        {item.quantity} Kg
                                    </td>

                                    <td className="p-3">
                                        {new Date(item.treatment_date).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">${item.cost}</td>

                                    <td className="p-3">{item.responsible_user_id}</td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setEditId(item.treatment_id);
                                                setForm(item);
                                            }}
                                            className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={async () => {
                                                await api.delete(`/treatments/${item.treatment_id}`);
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
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                    <div className="bg-white w-[420px] p-6 rounded-xl">

                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Treatment" : "Create Treatment"}
                        </h2>

                        <div className="flex flex-col gap-3">

                            {/* FIELD */}
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
                                value={form.crop_id}
                                onChange={(e) => setForm({ ...form, crop_id: Number(e.target.value) })}
                            >
                                <option value="">Select crop</option>
                                {crops.map(c => (
                                    <option key={c.crop_id} value={c.crop_id}>
                                        {c.crop_name}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="border p-2 rounded"
                                placeholder="Treatment type"
                                value={form.treatment_type}
                                onChange={(e) => setForm({ ...form, treatment_type: e.target.value })}
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Material used"
                                value={form.material_used}
                                onChange={(e) => setForm({ ...form, material_used: e.target.value })}
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Quantity"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            />
                            <input
                                className="border p-2 rounded"
                                type="date"
                                value={form.treatment_date}
                                onChange={(e) => setForm({ ...form, treatment_date: e.target.value })}
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Cost"
                                value={form.cost}
                                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                            />
                            <select
                                className="border p-2 rounded"
                                value={form.responsible_user_id}
                                onChange={(e) => setForm({ ...form, responsible_user_id: Number(e.target.value) })}
                            >
                                <option value="">Responsible user</option>
                                {users.map(u => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.name}
                                    </option>
                                ))}
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
                                onClick={saveTreatment}
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
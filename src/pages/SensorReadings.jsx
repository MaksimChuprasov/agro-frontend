import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function SensorReadings() {
    const [readings, setReadings] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        sensor_id: "",
        reading_value: "",
        unit: "%"
    });

    const fetchReadings = async () => {
        try {
            const res = await api.get("/sensor-readings");
            setReadings(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
            await fetchReadings();
            await fetchSensors();
        };

        load();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sensor Readings</h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + Add Reading
                </button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-auto max-h-[85vh]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Sensor</th>
                                <th className="p-3">Value</th>
                                <th className="p-3">Unit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {readings.map(r => (
                                <tr key={r.reading_id} className="border-t">

                                    <td className="p-3">{r.sensor_id}</td>
                                    <td className="p-3">{r.reading_value}</td>
                                    <td className="p-3">{r.unit}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">
                            Add Sensor Reading
                        </h2>
                        <div className="flex flex-col gap-3">
                            <select
                                className="border p-2 rounded"
                                value={form.sensor_id}
                                onChange={(e) =>
                                    setForm({ ...form, sensor_id: e.target.value })
                                }
                            >
                                <option value="">Select Sensor</option>
                                {sensors.map(s => (
                                    <option key={s.sensor_id} value={s.sensor_id}>
                                        Sensor #{s.sensor_id} ({s.sensor_type})
                                    </option>
                                ))}
                            </select>
                            <input
                                className="border p-2 rounded"
                                placeholder="Value"
                                value={form.reading_value}
                                onChange={(e) =>
                                    setForm({ ...form, reading_value: e.target.value })
                                }
                            />
                            <input
                                className="border p-2 rounded"
                                placeholder="Unit"
                                value={form.unit}
                                onChange={(e) =>
                                    setForm({ ...form, unit: e.target.value })
                                }
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
                                onClick={async () => {
                                    try {
                                        await api.post("/sensor-readings", {
                                            ...form,
                                            sensor_id: Number(form.sensor_id),
                                            reading_value: Number(form.reading_value)
                                        });

                                        setIsOpen(false);
                                        setForm({
                                            sensor_id: "",
                                            reading_value: "",
                                            unit: "%"
                                        });

                                        fetchReadings();

                                    } catch (err) {
                                        console.log(err.response?.data || err.message);
                                    }
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Save
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
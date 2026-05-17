import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Reports() {
    const [activeReport, setActiveReport] = useState("low-moisture-fields");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const reportsMap = {
        "low-moisture-fields": {
            title: "Low Moisture Fields",
            url: "/reports/low-moisture-fields"
        },
        "water-usage-by-field": {
            title: "Water Usage By Field",
            url: "/reports/water-usage-by-field"
        },
        "crops-ready-for-harvest": {
            title: "Crops Ready For Harvest",
            url: "/reports/crops-ready-for-harvest"
        },
        "tasks-by-employee": {
            title: "Tasks By Employee",
            url: "/reports/tasks-by-employee"
        },
        "offline-sensors": {
            title: "Offline Sensors",
            url: "/reports/offline-sensors"
        },
        "harvest-revenue": {
            title: "Harvest Revenue",
            url: "/reports/harvest-revenue"
        },
        "treatment-costs": {
            title: "Treatment Costs",
            url: "/reports/treatment-costs"
        }
    };

    const fetchReport = async (key) => {
        try {
            setLoading(true);
            const res = await api.get(reportsMap[key].url);
            setData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (rows) => {
        if (!rows || rows.length === 0) {
            return <p>No data</p>;
        }

        const columns = Object.keys(rows[0]);

        return (
            <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map(col => (
                            <th key={col} className="p-2 border-b capitalize">
                                {col.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t">
                            {columns.map(col => (
                                <td key={col} className="p-2 border-b">
                                    {formatValue(row[col])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return "-";

        // Дата
        if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            return new Date(value).toLocaleDateString();
        }

        // Числа
        if (typeof value === "number") {
            return value.toLocaleString();
        }

        // Объекты → JSON
        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return value;
    };

    useEffect(() => {
        fetchReport(activeReport);
    }, [activeReport]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {Object.keys(reportsMap).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveReport(key)}
                            className={`px-3 py-1 rounded text-sm border ${activeReport === key
                                ? "bg-green-500 text-white"
                                : "bg-white"
                                }`}
                        >
                            {reportsMap[key].title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-auto">
                        {renderTable(data)}
                    </div>
                )}

            </div>

        </div>
    );
}
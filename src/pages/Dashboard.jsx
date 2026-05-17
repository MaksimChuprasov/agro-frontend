import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get("/dashboard/summary")
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, []);

    if (!data) {
        return (
            <div className="text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    const cards = [
        { label: "Fields", value: data.total_fields },
        { label: "Crops", value: data.active_crops },
        { label: "Sensors Online", value: data.online_sensors },
        { label: "Sensors Offline", value: data.offline_sensors },
        { label: "Alerts", value: data.critical_alerts },
        { label: "Tasks", value: data.pending_tasks },
        { label: "Revenue", value: `$${data.total_revenue}` },
    ];

    return (
        <div>

            <h1 className="text-2xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {cards.map((c, i) => (
                    <div
                        key={i}
                        className="bg-white p-5 rounded-xl shadow-sm border"
                    >
                        <p className="text-gray-500 text-sm">
                            {c.label}
                        </p>

                        <p className="text-2xl font-bold mt-2">
                            {c.value}
                        </p>
                    </div>
                ))}

            </div>

        </div>
    );
}
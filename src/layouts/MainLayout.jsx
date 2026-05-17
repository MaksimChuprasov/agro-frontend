import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function MainLayout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
                <h1 className="text-xl font-bold mb-8 flex gap-2 items-center"><img className="w-8" src="../../public/logo.svg" alt="" /> AgroSense</h1>

                <nav className="flex flex-col gap-3 text-sm">

                    <NavLink to="/"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink to="/fields"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Fields
                    </NavLink>

                    <NavLink to="/crops"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Crops
                    </NavLink>

                    <NavLink to="/sensors"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Sensors
                    </NavLink>

                    <NavLink to="/sensor-readings"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Sensor Readings
                    </NavLink>

                    <NavLink to="/irrigation"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Irrigation
                    </NavLink>

                    <NavLink to="/tasks"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Tasks
                    </NavLink>

                    <NavLink to="/treatments"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Treatments
                    </NavLink>

                    <NavLink to="/harvests"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Harvest Records
                    </NavLink>

                    <NavLink to="/reports"
                        className={({ isActive }) =>
                            `px-2 py-1 rounded transition ${isActive
                                ? "bg-gray-700 text-white"
                                : "text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        Reports
                    </NavLink>

                </nav>

                <button
                    onClick={logout}
                    className="mt-auto bg-red-500 p-2 rounded"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1 p-6 w-full">
                <Outlet />
            </main>

        </div>
    );
}
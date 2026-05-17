import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Fields from "../pages/Fields";
import Crops from "../pages/Crops";
import Sensors from "../pages/Sensors";
import SensorReadings from "../pages/SensorReadings";
import Irrigation from "../pages/Irrigation";
import Tasks from "../pages/Tasks";
import Treatments from "../pages/Treatments";
import Harvests from "../pages/Harvests";
import Reports from "../pages/Reports";

import MainLayout from "../layouts/MainLayout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/fields" element={<Fields />} />
                    <Route path="/crops" element={<Crops />} />
                    <Route path="/sensors" element={<Sensors />} />
                    <Route path="/sensor-readings" element={<SensorReadings />} />
                    <Route path="/irrigation" element={<Irrigation />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/treatments" element={<Treatments />} />
                    <Route path="/harvests" element={<Harvests />} />
                    <Route path="/reports" element={<Reports />} />
                </Route>

            </Routes>
        </BrowserRouter>


    );
}
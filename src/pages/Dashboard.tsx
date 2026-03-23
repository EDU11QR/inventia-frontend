import { useEffect, useState } from "react";
import api from "../api/api";

type DashboardData = {
    totalRevenue: number;
    totalSales: number;
    todaySales: number;
    lowStockProducts: number;
};

function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        api.get("/dashboard")
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error cargando dashboard:", err));
    }, []);

    if (!data) {
        return <p className="p-6">Cargando dashboard...</p>;
    }

    return (
        <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Ingresos totales</p>
                    <h2 className="text-2xl font-bold text-green-700">
                        S/ {data.totalRevenue}
                    </h2>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total de ventas</p>
                    <h2 className="text-2xl font-bold text-blue-700">
                        {data.totalSales}
                    </h2>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Ventas de hoy</p>
                    <h2 className="text-2xl font-bold text-purple-700">
                        {data.todaySales}
                    </h2>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Productos con stock bajo</p>
                    <h2 className="text-2xl font-bold text-red-600">
                        {data.lowStockProducts}
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
import { useEffect, useState } from "react";
import api from "../api/api";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type DashboardData = {
    totalRevenue: number;
    totalSales: number;
    todaySales: number;
    lowStockProducts: number;
};

type SalesByDay = {
    day: string;
    total: number;
};

type TopProduct = {
    productName: string;
    totalQuantity: number;
};

function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [salesByDay, setSalesByDay] = useState<SalesByDay[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

    useEffect(() => {
        api
            .get("/dashboard")
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error cargando dashboard:", err));

        api
            .get("/sales/by-day")
            .then((res) => setSalesByDay(res.data))
            .catch((err) => console.error("Error cargando ventas por día:", err));

        api
            .get("/sales/top-products")
            .then((res) => setTopProducts(res.data))
            .catch((err) => console.error("Error cargando top productos:", err));
    }, []);

    if (!data) {
        return (
            <div className="w-full min-w-0 bg-white shadow rounded-lg p-4 md:p-6">
                <p className="text-gray-500">Cargando dashboard...</p>
            </div>
        );
    }

    const chartData = [
        { name: "Ingresos", value: data.totalRevenue },
        { name: "Ventas", value: data.totalSales },
        { name: "Hoy", value: data.todaySales },
        { name: "Stock bajo", value: data.lowStockProducts },
    ];

    return (
        <div className="w-full min-w-0 space-y-6">
            {data.lowStockProducts > 0 && (
                <div className="bg-red-500 text-white rounded-lg p-4 shadow">
                    ⚠️ Tienes {data.lowStockProducts} producto(s) con stock bajo.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-xl p-4 md:p-5 border-l-4 border-green-600 min-w-0">
                    <p className="text-sm text-gray-500 mb-2">Ingresos totales</p>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-2xl font-bold text-green-700 break-words">
                            S/ {data.totalRevenue}
                        </h2>
                        <span className="text-2xl shrink-0">💰</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-4 md:p-5 border-l-4 border-blue-600 min-w-0">
                    <p className="text-sm text-gray-500 mb-2">Total de ventas</p>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-2xl font-bold text-blue-700">
                            {data.totalSales}
                        </h2>
                        <span className="text-2xl shrink-0">🧾</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-4 md:p-5 border-l-4 border-purple-600 min-w-0">
                    <p className="text-sm text-gray-500 mb-2">Ventas de hoy</p>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-2xl font-bold text-purple-700">
                            {data.todaySales}
                        </h2>
                        <span className="text-2xl shrink-0">📅</span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-4 md:p-5 border-l-4 border-red-600 min-w-0">
                    <p className="text-sm text-gray-500 mb-2">Stock bajo</p>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl md:text-2xl font-bold text-red-600">
                            {data.lowStockProducts}
                        </h2>
                        <span className="text-2xl shrink-0">⚠️</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-xl p-4 md:p-6 min-w-0">
                    <h2 className="text-lg font-bold mb-4">Ventas por día</h2>

                    <div className="w-full h-72 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                    minTickGap={20}
                                />
                                <YAxis tick={{ fontSize: 12 }} width={40} />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-4 md:p-6 min-w-0">
                    <h2 className="text-lg font-bold mb-4">Top productos más vendidos</h2>

                    <div className="w-full h-72 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="productName"
                                    tick={{ fontSize: 12 }}
                                    interval={0}
                                    angle={topProducts.length > 4 ? -15 : 0}
                                    textAnchor={topProducts.length > 4 ? "end" : "middle"}
                                    height={60}
                                />
                                <YAxis tick={{ fontSize: 12 }} width={40} />
                                <Tooltip />
                                <Bar dataKey="totalQuantity" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 md:p-6 min-w-0">
                <h2 className="text-lg font-bold mb-4">Resumen visual</h2>

                <div className="w-full h-72 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} width={40} />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 md:p-6 min-w-0">
                <h2 className="text-lg font-bold mb-4">Resumen general</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="font-semibold mb-2">Estado del negocio</p>
                        <p>
                            Tu sistema registra <strong>{data.totalSales}</strong> ventas en total
                            con ingresos acumulados de <strong>S/ {data.totalRevenue}</strong>.
                        </p>
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="font-semibold mb-2">Estado del inventario</p>
                        <p>
                            Actualmente tienes <strong>{data.lowStockProducts}</strong> producto(s)
                            que requieren atención por stock bajo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
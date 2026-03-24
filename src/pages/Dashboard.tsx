import { useEffect, useMemo, useState } from "react";
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

    const chartData = useMemo(() => {
        if (!data) return [];

        return [
            { name: "Ingresos", value: data.totalRevenue },
            { name: "Ventas", value: data.totalSales },
            { name: "Hoy", value: data.todaySales },
            { name: "Stock bajo", value: data.lowStockProducts },
        ];
    }, [data]);

    if (!data) {
        return (
            <div className="w-full min-w-0 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
                    <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
                </div>

                <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
            </div>
        );
    }

    const averageTicket =
        data.totalSales > 0 ? (data.totalRevenue / data.totalSales).toFixed(2) : "0.00";

    return (
        <div className="w-full min-w-0 space-y-6">
            {data.lowStockProducts > 0 && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-red-700">
                                Alerta de inventario
                            </p>
                            <p className="mt-1 text-sm text-red-600">
                                Tienes {data.lowStockProducts} producto
                                {data.lowStockProducts !== 1 ? "s" : ""} con stock bajo que
                                requieren atención.
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                            Stock bajo: {data.lowStockProducts}
                        </div>
                    </div>
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">
                                Ingresos totales
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                S/ {data.totalRevenue}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Total acumulado registrado
                            </p>
                        </div>
                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xl">💰</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">
                                Total de ventas
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {data.totalSales}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Operaciones registradas
                            </p>
                        </div>
                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xl">🧾</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">
                                Ventas de hoy
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {data.todaySales}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Actividad del día actual
                            </p>
                        </div>
                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xl">📅</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500">
                                Ticket promedio
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                S/ {averageTicket}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Ingreso promedio por venta
                            </p>
                        </div>
                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xl">📈</span>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Ventas por día
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Evolución diaria de ventas registradas.
                        </p>
                    </div>

                    {salesByDay.length === 0 ? (
                        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                            No hay datos de ventas por día para mostrar.
                        </div>
                    ) : (
                        <div className="h-80 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={salesByDay}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fontSize: 12 }}
                                        interval="preserveStartEnd"
                                        minTickGap={24}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} width={44} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        strokeWidth={3}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Top productos más vendidos
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Productos con mayor volumen de salida.
                        </p>
                    </div>

                    {topProducts.length === 0 ? (
                        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                            No hay datos de productos vendidos para mostrar.
                        </div>
                    ) : (
                        <div className="h-80 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topProducts}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="productName"
                                        tick={{ fontSize: 12 }}
                                        interval={0}
                                        angle={topProducts.length > 4 ? -15 : 0}
                                        textAnchor={topProducts.length > 4 ? "end" : "middle"}
                                        height={topProducts.length > 4 ? 70 : 40}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} width={44} />
                                    <Tooltip />
                                    <Bar dataKey="totalQuantity" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Resumen general
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Panorama rápido del estado comercial y del inventario.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                            Estado del negocio
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Tu sistema registra <strong>{data.totalSales}</strong> ventas en
                            total con ingresos acumulados de{" "}
                            <strong>S/ {data.totalRevenue}</strong>.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                            Estado del inventario
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Actualmente tienes <strong>{data.lowStockProducts}</strong>{" "}
                            producto{data.lowStockProducts !== 1 ? "s" : ""} que requieren
                            atención por stock bajo.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                            Lectura operativa
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            El ticket promedio actual es de <strong>S/ {averageTicket}</strong>,
                            útil para evaluar el rendimiento del punto de venta.
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-slate-700">
                            Resumen comparativo
                        </p>
                        <p className="text-sm text-slate-500">
                            Comparación rápida entre métricas generales.
                        </p>
                    </div>

                    <div className="h-72 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} width={44} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
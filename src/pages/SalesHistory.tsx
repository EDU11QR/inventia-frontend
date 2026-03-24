import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

type Product = {
    id: number;
    name: string;
};

type SaleDetail = {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
};

type Sale = {
    id: number;
    total: number;
    date: string;
    details: SaleDetail[];
};

function SalesHistory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        api
            .get("/sales")
            .then((res) => setSales(res.data))
            .catch((err) => console.error("Error cargando ventas:", err));
    }, []);

    const filteredSales = useMemo(() => {
        return sales.filter((sale) => {
            const saleDate = new Date(sale.date);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            if (from && saleDate < from) return false;

            if (to) {
                const endOfDay = new Date(to);
                endOfDay.setHours(23, 59, 59, 999);
                if (saleDate > endOfDay) return false;
            }

            return true;
        });
    }, [sales, fromDate, toDate]);

    const totalFilteredSales = filteredSales.length;

    const totalFilteredRevenue = filteredSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    );

    const totalFilteredItems = filteredSales.reduce(
        (sum, sale) =>
            sum +
            sale.details.reduce(
                (detailSum, detail) => detailSum + detail.quantity,
                0
            ),
        0
    );

    const averageSale =
        totalFilteredSales > 0
            ? (totalFilteredRevenue / totalFilteredSales).toFixed(2)
            : "0.00";

    const resetFilters = () => {
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="w-full min-w-0 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Filtros de historial
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Consulta ventas por rango de fechas y revisa sus detalles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Desde
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Hasta
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="w-full rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ventas encontradas</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {totalFilteredSales}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Operaciones dentro del rango actual
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ingresos del rango</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        S/ {totalFilteredRevenue.toFixed(2)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Total vendido en el período filtrado
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Productos vendidos</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {totalFilteredItems}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Unidades acumuladas en las ventas filtradas
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ticket promedio</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        S/ {averageSale}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Ingreso promedio por venta filtrada
                    </p>
                </div>
            </section>

            {filteredSales.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        No hay ventas para el rango seleccionado.
                    </p>
                </div>
            ) : (
                <section className="space-y-5">
                    {filteredSales.map((sale) => {
                        const itemCount = sale.details.reduce(
                            (sum, detail) => sum + detail.quantity,
                            0
                        );

                        return (
                            <article
                                key={sale.id}
                                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="border-b border-slate-100 p-4 sm:p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Venta #{sale.id}
                                                </h3>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {itemCount} ítem{itemCount !== 1 ? "s" : ""}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-slate-500">
                                                Fecha: {new Date(sale.date).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                                            <p className="text-sm text-emerald-700">Total de la venta</p>
                                            <p className="text-2xl font-bold tracking-tight text-emerald-700">
                                                S/ {sale.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full border-collapse">
                                            <thead className="bg-slate-900 text-white">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                                        Producto
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                                        Cantidad
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                                        Precio
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {sale.details.map((detail) => (
                                                    <tr
                                                        key={detail.id}
                                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                                    >
                                                        <td className="px-4 py-4 font-medium text-slate-900">
                                                            {detail.product?.name || "Producto sin nombre"}
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-700">
                                                            {detail.quantity}
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-700">
                                                            S/ {detail.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-4 font-semibold text-slate-900">
                                                            S/ {detail.subtotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-3 md:hidden">
                                        {sale.details.map((detail) => (
                                            <div
                                                key={detail.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900">
                                                            {detail.product?.name || "Producto sin nombre"}
                                                        </p>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Cantidad: {detail.quantity}
                                                        </p>
                                                    </div>

                                                    <p className="text-sm font-semibold text-slate-700">
                                                        S/ {detail.subtotal.toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="rounded-xl bg-white p-3">
                                                        <p className="text-slate-500">Precio</p>
                                                        <p className="mt-1 font-medium text-slate-900">
                                                            S/ {detail.price.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-white p-3">
                                                        <p className="text-slate-500">Subtotal</p>
                                                        <p className="mt-1 font-medium text-slate-900">
                                                            S/ {detail.subtotal.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </div>
    );
}

export default SalesHistory;
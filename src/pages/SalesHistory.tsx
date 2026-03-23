import { useEffect, useState } from "react";
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

    const filteredSales = sales.filter((sale) => {
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

    const totalFilteredSales = filteredSales.length; //total de ventas

    const totalFilteredRevenue = filteredSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    ); //total de ingresos

    const totalFilteredItems = filteredSales.reduce(
        (sum, sale) =>
            sum + sale.details.reduce((detailSum, detail) => detailSum + detail.quantity, 0),
        0
    ); //total de items



    return (
        <div className="p-6">

            <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desde
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hasta
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <button
                    onClick={() => {
                        setFromDate("");
                        setToDate("");
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Ventas encontradas</p>
                    <h2 className="text-2xl font-bold text-blue-700">
                        {totalFilteredSales}
                    </h2>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Ingresos del rango</p>
                    <h2 className="text-2xl font-bold text-green-700">
                        S/ {totalFilteredRevenue}
                    </h2>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-sm text-gray-500">Productos vendidos</p>
                    <h2 className="text-2xl font-bold text-purple-700">
                        {totalFilteredItems}
                    </h2>
                </div>
            </div>

            {filteredSales.length === 0 ? (
                <p className="text-gray-500 bg-white p-4 rounded shadow">
                    No hay ventas para el rango seleccionado.
                </p>
            ) : (
                <div className="space-y-4">
                    {filteredSales.map((sale) => (
                        <div key={sale.id} className="bg-white shadow rounded-lg p-4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                                <div>
                                    <p className="font-bold">Venta #{sale.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Fecha: {new Date(sale.date).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Ítems: {sale.details.reduce((sum, d) => sum + d.quantity, 0)}
                                    </p>
                                </div>

                                <p className="text-lg font-bold text-green-700">
                                    Total: S/ {sale.total}
                                </p>
                            </div>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="p-2">Producto</th>
                                        <th className="p-2">Cantidad</th>
                                        <th className="p-2">Precio</th>
                                        <th className="p-2">Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sale.details.map((detail) => (
                                        <tr key={detail.id} className="border-t">
                                            <td className="p-2">{detail.product?.name}</td>
                                            <td className="p-2">{detail.quantity}</td>
                                            <td className="p-2">S/ {detail.price}</td>
                                            <td className="p-2">S/ {detail.subtotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SalesHistory;
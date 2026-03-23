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

    useEffect(() => {
        api
            .get("/sales")
            .then((res) => setSales(res.data))
            .catch((err) => console.error("Error cargando ventas:", err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Historial de Ventas</h1>

            {sales.length === 0 ? (
                <p className="text-gray-500">No hay ventas registradas.</p>
            ) : (
                <div className="space-y-4">
                    {sales.map((sale) => (
                        <div key={sale.id} className="bg-white shadow rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="font-bold">Venta #{sale.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Fecha: {new Date(sale.date).toLocaleString()}
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
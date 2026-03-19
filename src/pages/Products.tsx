import { useEffect, useState } from "react";
import api from "../api/api";

function Products() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        api.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>

            <table className="w-full border">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Precio</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2">Categoría</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="text-center border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{p.price}</td>
                            <td className="p-2">{p.stock}</td>
                            <td className="p-2">{p.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;
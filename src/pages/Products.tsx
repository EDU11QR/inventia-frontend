import { useEffect, useState } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    stockMinimum: number;
    category: string;
};

type ProductForm = {
    name: string;
    description: string;
    price: number;
    stock: number;
    stockMinimum: number;
    category: string;
};

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        stockMinimum: 0,
        category: "",
    });

    useEffect(() => {
        api
            .get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async () => {
        try {
            if (!form.name || form.price <= 0) {
                showToast("Nombre y precio son obligatorios", "error");
                return;
            }

            setLoading(true);

            if (editingId) {
                await api.put(`/products/${editingId}`, form);
                showToast("Producto actualizado correctamente", "success");
            } else {
                await api.post("/products", form);
                showToast("Producto creado correctamente", "success");
            }

            const res = await api.get("/products");
            setProducts(res.data);

            setForm({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                stockMinimum: 0,
                category: "",
            });

            setEditingId(null);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            showToast("No se pudo guardar el producto", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (productToDelete === null) return;

        try {
            await api.delete(`/products/${productToDelete}`);
            const res = await api.get("/products");
            setProducts(res.data);
            showToast("Producto eliminado correctamente", "success");
        } catch (error) {
            console.error(error);
            showToast("No se pudo eliminar el producto", "error");
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleEdit = (product: Product) => {
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            stockMinimum: product.stockMinimum,
            category: product.category,
        });

        setEditingId(product.id);
        setShowForm(true);
    };

    const lowStockCount = products.filter(
        (p) => p.stock <= p.stockMinimum
    ).length;

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Eliminar producto"
                message="¿Estás seguro de que deseas eliminar este producto?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }}
            />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Productos</h1>

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 mb-4 w-full rounded"
                />

                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setForm({
                            name: "",
                            description: "",
                            price: 0,
                            stock: 0,
                            stockMinimum: 0,
                            category: "",
                        });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 shadow"
                >
                    Agregar Producto
                </button>

                {showForm && (
                    <div className="mb-4 p-4 border rounded">
                        <h2 className="font-bold mb-2">
                            {editingId ? "Editar Producto" : "Nuevo Producto"}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            <input
                                placeholder="Nombre"
                                className="border p-2"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <input
                                placeholder="Descripción"
                                className="border p-2"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />

                            <input
                                placeholder="Precio"
                                type="number"
                                className="border p-2"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: Number(e.target.value) })
                                }
                            />

                            <input
                                placeholder="Stock"
                                type="number"
                                className="border p-2"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({ ...form, stock: Number(e.target.value) })
                                }
                            />

                            <input
                                placeholder="Stock mínimo"
                                type="number"
                                className="border p-2"
                                value={form.stockMinimum}
                                onChange={(e) =>
                                    setForm({ ...form, stockMinimum: Number(e.target.value) })
                                }
                            />

                            <input
                                placeholder="Categoría"
                                className="border p-2"
                                value={form.category}
                                onChange={(e) =>
                                    setForm({ ...form, category: e.target.value })
                                }
                            />

                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow"
                            >
                                {loading
                                    ? "Guardando..."
                                    : editingId
                                        ? "Actualizar"
                                        : "Guardar"}
                            </button>
                        </div>
                    </div>
                )}

                {lowStockCount > 0 && (
                    <div className="bg-red-500 text-white p-3 mb-4 rounded">
                        ⚠️ Hay {lowStockCount} productos con stock bajo
                    </div>
                )}

                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Descripción</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Stock Mínimo</th>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((p) => {
                            const lowStock = p.stock <= p.stockMinimum && p.stock > 0;

                            return (
                                <tr
                                    key={p.id}
                                    className={`text-center border-t ${lowStock ? "bg-red-100" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <td className="p-3 font-semibold">{p.name}</td>
                                    <td className="p-3">{p.description}</td>
                                    <td className="p-3">S/ {p.price}</td>
                                    <td className={`p-3 font-bold ${lowStock ? "text-red-600" : ""}`}>
                                        {p.stock}
                                    </td>
                                    <td className="p-3">{p.stockMinimum}</td>
                                    <td className="p-3">{p.category}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(p.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>

    );
}

export default Products;
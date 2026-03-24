import { useEffect, useMemo, useState } from "react";
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

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        stockMinimum: 0,
        category: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            showToast("No se pudieron cargar los productos", "error");
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: 0,
            stock: 0,
            stockMinimum: 0,
            category: "",
        });
        setEditingId(null);
    };

    const openCreateForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleSubmit = async () => {
        try {
            if (!form.name.trim() || form.price <= 0) {
                showToast("Nombre y precio son obligatorios", "error");
                return;
            }

            setLoading(true);

            if (editingId !== null) {
                await api.put(`/products/${editingId}`, form);
                showToast("Producto actualizado correctamente", "success");
            } else {
                await api.post("/products", form);
                showToast("Producto creado correctamente", "success");
            }

            await fetchProducts();
            resetForm();
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
            await fetchProducts();
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

    const filteredProducts = useMemo(() => {
        const term = search.toLowerCase().trim();

        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term)
        );
    }, [products, search]);

    const lowStockCount = products.filter((p) => p.stock <= p.stockMinimum).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalInventoryValue = products.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
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

            <div className="w-full min-w-0 space-y-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Productos totales</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {products.length}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Productos registrados en el inventario
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Resultados visibles</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {filteredProducts.length}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Productos según la búsqueda actual
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Stock bajo</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {lowStockCount}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Productos que requieren reposición
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Valor de inventario</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            S/ {totalInventoryValue.toFixed(2)}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Valor estimado según stock actual
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Gestión de productos
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Busca, crea, edita y administra el catálogo del inventario.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                            <div className="w-full sm:min-w-[300px]">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o categoría..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={openCreateForm}
                                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                                >
                                    Crear producto
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {(lowStockCount > 0 || outOfStockCount > 0) && (
                    <section className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-red-700">
                                    Alerta de inventario
                                </p>
                                <p className="mt-1 text-sm text-red-600">
                                    Hay {lowStockCount} producto{lowStockCount !== 1 ? "s" : ""} con
                                    stock bajo y {outOfStockCount} sin stock.
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                                Revisar reposición
                            </div>
                        </div>
                    </section>
                )}

                {showForm && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {editingId !== null ? "Editar producto" : "Nuevo producto"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Completa la información del producto para guardarlo en el sistema.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nombre
                                </label>
                                <input
                                    placeholder="Ej. Polo oversize"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Descripción
                                </label>
                                <input
                                    placeholder="Ej. Algodón premium"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Precio
                                </label>
                                <input
                                    placeholder="0.00"
                                    type="number"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: Number(e.target.value) })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Stock
                                </label>
                                <input
                                    placeholder="0"
                                    type="number"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.stock}
                                    onChange={(e) =>
                                        setForm({ ...form, stock: Number(e.target.value) })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Stock mínimo
                                </label>
                                <input
                                    placeholder="0"
                                    type="number"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.stockMinimum}
                                    onChange={(e) =>
                                        setForm({ ...form, stockMinimum: Number(e.target.value) })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Categoría
                                </label>
                                <input
                                    placeholder="Ej. Polos"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                            >
                                Cancelar
                            </button>

                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                            >
                                {loading
                                    ? "Guardando..."
                                    : editingId !== null
                                        ? "Actualizar producto"
                                        : "Guardar producto"}
                            </button>
                        </div>
                    </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Lista de productos
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Gestiona stock, precios y categorías de cada producto.
                        </p>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-sm text-slate-500">
                                No se encontraron productos con esa búsqueda.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Nombre</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Descripción</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Precio</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Stock</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Stock mínimo</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Categoría</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold">Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProducts.map((p) => {
                                            const lowStock = p.stock <= p.stockMinimum && p.stock > 0;
                                            const outOfStock = p.stock === 0;

                                            return (
                                                <tr
                                                    key={p.id}
                                                    className={`border-b border-slate-100 transition hover:bg-slate-50 ${lowStock ? "bg-orange-50" : outOfStock ? "bg-red-50" : "bg-white"
                                                        }`}
                                                >
                                                    <td className="px-4 py-4 font-semibold text-slate-900">
                                                        {p.name}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600">
                                                        {p.description || "—"}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-700">
                                                        S/ {p.price.toFixed(2)}
                                                    </td>
                                                    <td
                                                        className={`px-4 py-4 font-bold ${outOfStock
                                                            ? "text-red-600"
                                                            : lowStock
                                                                ? "text-orange-600"
                                                                : "text-slate-800"
                                                            }`}
                                                    >
                                                        {p.stock}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-700">
                                                        {p.stockMinimum}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-700">
                                                        {p.category || "—"}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => handleEdit(p)}
                                                                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                                                            >
                                                                Editar
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteClick(p.id)}
                                                                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                {filteredProducts.map((p) => {
                                    const lowStock = p.stock <= p.stockMinimum && p.stock > 0;
                                    const outOfStock = p.stock === 0;

                                    return (
                                        <div
                                            key={p.id}
                                            className={`rounded-2xl border p-4 shadow-sm ${outOfStock
                                                ? "border-red-200 bg-red-50"
                                                : lowStock
                                                    ? "border-orange-200 bg-orange-50"
                                                    : "border-slate-200 bg-white"
                                                }`}
                                        >
                                            <div className="mb-4 flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-900">
                                                        {p.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {p.category || "Sin categoría"}
                                                    </p>
                                                </div>

                                                {outOfStock ? (
                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        Sin stock
                                                    </span>
                                                ) : lowStock ? (
                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                        Stock bajo
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                        Disponible
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-slate-500">Descripción</span>
                                                    <span className="text-right font-medium text-slate-800">
                                                        {p.description || "—"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between gap-4">
                                                    <span className="text-slate-500">Precio</span>
                                                    <span className="font-medium text-slate-800">
                                                        S/ {p.price.toFixed(2)}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between gap-4">
                                                    <span className="text-slate-500">Stock</span>
                                                    <span
                                                        className={`font-bold ${outOfStock
                                                            ? "text-red-600"
                                                            : lowStock
                                                                ? "text-orange-600"
                                                                : "text-slate-800"
                                                            }`}
                                                    >
                                                        {p.stock}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between gap-4">
                                                    <span className="text-slate-500">Stock mínimo</span>
                                                    <span className="font-medium text-slate-800">
                                                        {p.stockMinimum}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(p.id)}
                                                    className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}

export default Products;
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

type CartItem = Product & {
    quantity: number;
};

function Sales() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showClearCartModal, setShowClearCartModal] = useState(false);

    useEffect(() => {
        api
            .get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.error("Error cargando productos:", err);
                showToast("No se pudieron cargar los productos", "error");
            });
    }, []);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCheckoutClick = () => {
        if (cart.length === 0) {
            showToast("El carrito está vacío", "error");
            return;
        }

        setShowCheckoutModal(true);
    };

    const handleClearCartClick = () => {
        if (cart.length === 0) {
            showToast("El carrito ya está vacío", "error");
            return;
        }

        setShowClearCartModal(true);
    };

    const confirmClearCart = () => {
        setCart([]);
        setShowClearCartModal(false);
        showToast("Carrito vaciado correctamente", "success");
    };

    const addToCart = (product: Product) => {
        const existing = cart.find((p) => p.id === product.id);

        if (product.stock === 0) {
            showToast("Este producto no tiene stock disponible", "error");
            return;
        }

        if (existing) {
            if (existing.quantity >= product.stock) {
                showToast("No puedes agregar más unidades que el stock disponible", "error");
                return;
            }

            setCart(
                cart.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: number, amount: number) => {
        setCart(
            cart.map((p) => {
                if (p.id !== id) return p;

                const product = products.find((prod) => prod.id === id);
                if (!product) return p;

                const newQuantity = p.quantity + amount;

                if (newQuantity < 1) {
                    return p;
                }

                if (newQuantity > product.stock) {
                    showToast("No puedes superar el stock disponible", "error");
                    return p;
                }

                return { ...p, quantity: newQuantity };
            })
        );
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((p) => p.id !== id));
    };

    const total = useMemo(
        () => cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
        [cart]
    );

    const totalItems = useMemo(
        () => cart.reduce((sum, p) => sum + p.quantity, 0),
        [cart]
    );

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockVisible = filteredProducts.filter(
        (p) => p.stock <= p.stockMinimum && p.stock > 0
    ).length;

    const confirmCheckout = async () => {
        try {
            const payload = {
                items: cart.map((p) => ({
                    productId: p.id,
                    quantity: p.quantity,
                })),
            };

            await api.post("/sales", payload);

            showToast("Venta realizada correctamente", "success");
            setCart([]);

            const res = await api.get("/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Error al completar venta:", error);
            showToast("No se pudo completar la venta", "error");
        } finally {
            setShowCheckoutModal(false);
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}

            <ConfirmModal
                isOpen={showCheckoutModal}
                title="Confirmar venta"
                message={`¿Deseas confirmar esta venta por S/ ${total.toFixed(
                    2
                )}? Productos: ${totalItems}`}
                onConfirm={confirmCheckout}
                onCancel={() => setShowCheckoutModal(false)}
            />

            <ConfirmModal
                isOpen={showClearCartModal}
                title="Vaciar carrito"
                message="¿Estás seguro de que deseas vaciar todo el carrito?"
                onConfirm={confirmClearCart}
                onCancel={() => setShowClearCartModal(false)}
            />

            <div className="w-full min-w-0 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Productos visibles</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {filteredProducts.length}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Catálogo según la búsqueda actual
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Items en carrito</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {totalItems}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Cantidad total de unidades agregadas
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Stock bajo visible</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {lowStockVisible}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Productos visibles con alerta de stock
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-4 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Catálogo de productos
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Agrega productos al carrito y valida disponibilidad de stock.
                                    </p>
                                </div>

                                <div className="w-full lg:max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o categoría..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            {filteredProducts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                    <p className="text-sm text-slate-500">
                                        No se encontraron productos con esa búsqueda.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {filteredProducts.map((p) => {
                                        const lowStock = p.stock <= p.stockMinimum && p.stock > 0;
                                        const outOfStock = p.stock === 0;

                                        return (
                                            <div
                                                key={p.id}
                                                className={`rounded-2xl border p-4 shadow-sm transition ${outOfStock
                                                    ? "border-slate-200 bg-slate-50"
                                                    : lowStock
                                                        ? "border-orange-200 bg-orange-50"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-semibold text-slate-900">
                                                            {p.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {p.description || "Sin descripción"}
                                                        </p>
                                                    </div>

                                                    {outOfStock ? (
                                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
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

                                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-slate-500">Categoría</p>
                                                        <p className="mt-1 font-medium text-slate-800">
                                                            {p.category || "General"}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-slate-500">Stock</p>
                                                        <p
                                                            className={`mt-1 font-semibold ${outOfStock
                                                                ? "text-red-600"
                                                                : lowStock
                                                                    ? "text-orange-600"
                                                                    : "text-slate-800"
                                                                }`}
                                                        >
                                                            {p.stock}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-end justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500">Precio</p>
                                                        <p className="text-xl font-bold text-slate-900">
                                                            S/ {p.price.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => addToCart(p)}
                                                        disabled={outOfStock}
                                                        className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${outOfStock
                                                            ? "cursor-not-allowed bg-slate-400"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                            }`}
                                                    >
                                                        {outOfStock ? "Sin stock" : "Agregar"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="xl:sticky xl:top-24 xl:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-4 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Carrito de venta
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Revisa cantidades, subtotales y confirma la operación.
                                        </p>
                                    </div>

                                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                                        {cart.length} producto{cart.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {cart.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                        <p className="text-sm text-slate-500">
                                            No hay productos en el carrito.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((p) => (
                                            <div
                                                key={p.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-semibold text-slate-900">
                                                            {p.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Precio unitario: S/ {p.price.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(p.id)}
                                                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(p.id, -1)}
                                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                        >
                                                            -
                                                        </button>

                                                        <div className="min-w-[52px] rounded-xl bg-white px-4 py-2 text-center font-semibold text-slate-900 ring-1 ring-slate-200">
                                                            {p.quantity}
                                                        </div>

                                                        <button
                                                            onClick={() => updateQuantity(p.id, 1)}
                                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm text-slate-500">Subtotal</p>
                                                        <p className="text-lg font-bold text-emerald-700">
                                                            S/ {(p.price * p.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Unidades</span>
                                        <span className="font-medium text-slate-900">{totalItems}</span>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                                        <span>Productos distintos</span>
                                        <span className="font-medium text-slate-900">{cart.length}</span>
                                    </div>

                                    <div className="mt-4 border-t border-slate-200 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-600">Total</span>
                                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                                S/ {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        onClick={handleClearCartClick}
                                        disabled={cart.length === 0}
                                        className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${cart.length === 0
                                            ? "cursor-not-allowed bg-slate-400"
                                            : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        Vaciar carrito
                                    </button>

                                    <button
                                        onClick={handleCheckoutClick}
                                        disabled={cart.length === 0}
                                        className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${cart.length === 0
                                            ? "cursor-not-allowed bg-slate-400"
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                            }`}
                                    >
                                        Confirmar venta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

export default Sales;
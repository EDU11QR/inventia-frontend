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
    const handleCheckoutClick = () => {
        if (cart.length === 0) {
            showToast("El carrito está vacío", "error");
            return;
        }

        setShowCheckoutModal(true);
    };

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
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
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

    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

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
                message={`¿Deseas confirmar esta venta por S/ ${total}? Productos: ${totalItems}`}
                onConfirm={confirmCheckout}
                onCancel={() => setShowCheckoutModal(false)}
            />

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PRODUCTOS */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Productos</h2>

                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                    />

                    {filteredProducts.length === 0 ? (
                        <p className="text-gray-500">No se encontraron productos</p>
                    ) : (
                        filteredProducts.map((p) => {
                            const lowStock = p.stock <= p.stockMinimum && p.stock > 0;

                            return (
                                <div
                                    key={p.id}
                                    className="border p-3 mb-2 rounded flex justify-between items-center bg-white shadow-sm"
                                >
                                    <div>
                                        <p className="font-semibold text-lg">{p.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {p.description || "Sin descripción"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Categoría: {p.category || "General"}
                                        </p>

                                        <p
                                            className={`text-sm font-medium ${p.stock === 0 ? "text-red-600" : "text-gray-700"
                                                }`}
                                        >
                                            Stock disponible: {p.stock}
                                        </p>

                                        {lowStock && (
                                            <p className="text-xs text-orange-600 font-semibold">
                                                Stock bajo
                                            </p>
                                        )}

                                        <p className="font-bold text-green-700">S/ {p.price}</p>
                                    </div>

                                    <button
                                        onClick={() => addToCart(p)}
                                        disabled={p.stock === 0}
                                        className={`px-3 py-2 rounded text-white ${p.stock === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        {p.stock === 0 ? "Sin stock" : "Agregar"}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* CARRITO */}
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Carrito ({cart.length})
                    </h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500">No hay productos en el carrito</p>
                    ) : (
                        cart.map((p) => (
                            <div
                                key={p.id}
                                className="border p-4 mb-3 rounded-lg shadow-sm bg-white"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-lg">{p.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Precio unitario: S/ {p.price}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(p.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 my-3">
                                    <button
                                        onClick={() => updateQuantity(p.id, -1)}
                                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                    >
                                        -
                                    </button>

                                    <span className="font-semibold">{p.quantity}</span>

                                    <button
                                        onClick={() => updateQuantity(p.id, 1)}
                                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="font-bold text-green-700">
                                    Subtotal: S/ {p.price * p.quantity}
                                </p>
                            </div>
                        ))
                    )}

                    <div className="mt-6 border-t pt-4">
                        <p className="text-gray-600 mb-1">Productos: {totalItems}</p>
                        <h3 className="font-bold text-xl mb-3">Total: S/ {total}</h3>

                        <button
                            onClick={handleCheckoutClick}
                            disabled={cart.length === 0}
                            className={`px-4 py-2 rounded text-white ${cart.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            Confirmar Venta
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sales;
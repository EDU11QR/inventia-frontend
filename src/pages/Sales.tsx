import { useEffect, useState } from "react";
import api from "../api/api";

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

    useEffect(() => {
        api.get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const addToCart = (product: Product) => {
        const existing = cart.find((p) => p.id === product.id);

        if (existing) {
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
            cart.map((p) =>
                p.id === id
                    ? { ...p, quantity: Math.max(1, p.quantity + amount) }
                    : p
            )
        );
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((p) => p.id !== id));
    };

    const total = cart.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        try {
            const payload = {
                items: cart.map((p) => ({
                    productId: p.id,
                    quantity: p.quantity,
                })),
            };

            await api.post("/sales", payload);

            alert("Venta realizada ✅");
            setCart([]);

            const res = await api.get("/products");
            setProducts(res.data);
        } catch (error) {
            console.error(error);
            alert("Error en la venta ❌");
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h2 className="text-xl font-bold mb-4">Productos</h2>

                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border p-3 mb-2 rounded flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-sm text-gray-500">{p.category}</p>
                            <p>S/ {p.price}</p>
                            <p>Stock: {p.stock}</p>
                        </div>

                        <button
                            onClick={() => addToCart(p)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                        >
                            Agregar
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Carrito</h2>

                {cart.length === 0 ? (
                    <p className="text-gray-500">No hay productos en el carrito</p>
                ) : (
                    cart.map((p) => (
                        <div
                            key={p.id}
                            className="border p-3 mb-2 rounded"
                        >
                            <p className="font-semibold">{p.name}</p>

                            <div className="flex items-center gap-2 my-2">
                                <button
                                    onClick={() => updateQuantity(p.id, -1)}
                                    className="bg-gray-200 px-2 py-1 rounded"
                                >
                                    -
                                </button>

                                <span>{p.quantity}</span>

                                <button
                                    onClick={() => updateQuantity(p.id, 1)}
                                    className="bg-gray-200 px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <p>Subtotal: S/ {p.price * p.quantity}</p>

                            <button
                                onClick={() => removeFromCart(p.id)}
                                className="text-red-500 mt-2"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))
                )}

                <h3 className="mt-4 font-bold text-lg">Total: S/ {total}</h3>

                <button
                    onClick={handleCheckout}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-2 rounded"
                >
                    Confirmar Venta
                </button>
            </div>
        </div>
    );
}

export default Sales;
type Page = "dashboard" | "products" | "sales" | "sales-history";

type SidebarProps = {
    page: Page;
    setPage: (page: Page) => void;
};

function Sidebar({ page, setPage }: SidebarProps) {
    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-4">
            <h1 className="text-2xl font-bold text-indigo-600 mb-8">
                LIBRERIA HUBER
            </h1>

            <nav className="flex flex-col gap-3">
                <button
                    onClick={() => setPage("dashboard")}
                    className={`text-left px-4 py-2 rounded ${page === "dashboard"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Dashboard
                </button>

                <button
                    onClick={() => setPage("products")}
                    className={`text-left px-4 py-2 rounded ${page === "products"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Productos
                </button>

                <button
                    onClick={() => setPage("sales")}
                    className={`text-left px-4 py-2 rounded ${page === "sales"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Ventas
                </button>

                <button
                    onClick={() => setPage("sales-history")}
                    className={`text-left px-4 py-2 rounded ${page === "sales-history"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                >
                    Historial de ventas
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;
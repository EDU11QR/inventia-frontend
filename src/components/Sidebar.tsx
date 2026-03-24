import type { Page } from "../App";

type SidebarProps = {
    page: Page;
    setPage: (page: Page) => void;
};

const navItems: { key: Page; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Productos" },
    { key: "sales", label: "Ventas" },
    { key: "sales-history", label: "Historial de ventas" },
];

function Sidebar({ page, setPage }: SidebarProps) {
    return (
        <aside className="w-full border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
            <div className="flex h-full flex-col">
                <div className="border-b border-slate-100 px-4 py-4 sm:px-6 lg:px-6 lg:py-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Sistema POS
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        INVENTIA
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Inventario, ventas y analytics
                    </p>
                </div>

                <nav className="p-3 sm:p-4 lg:p-4">
                    <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                        {navItems.map((item) => {
                            const isActive = page === item.key;

                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setPage(item.key)}
                                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition-all lg:w-full ${isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
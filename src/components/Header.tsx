type Page = "dashboard" | "products" | "sales" | "sales-history";

type HeaderProps = {
    page: Page;
};

function Header({ page }: HeaderProps) {
    const today = new Date().toLocaleDateString("es-PE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const pageTitles: Record<Page, string> = {
        dashboard: "Dashboard",
        products: "Productos",
        sales: "Ventas",
        "sales-history": "Historial de ventas",
    };

    return (
        <header className="bg-white shadow rounded-lg px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-sm text-gray-500">INVENTIA</p>
                <h1 className="text-2xl font-bold text-gray-800">
                    {pageTitles[page]}
                </h1>
            </div>

            <div className="mt-3 md:mt-0 text-sm text-gray-500 capitalize">
                {today}
            </div>
        </header>
    );
}

export default Header;
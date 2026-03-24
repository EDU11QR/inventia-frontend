import type { Page } from "../App";

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

    const pageDescriptions: Record<Page, string> = {
        dashboard: "Resumen general del negocio y métricas clave.",
        products: "Gestiona el catálogo, stock y productos disponibles.",
        sales: "Registra ventas y controla el flujo del punto de venta.",
        "sales-history": "Consulta el historial completo de ventas realizadas.",
    };

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex w-full flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">INVENTIA</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {pageTitles[page]}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {pageDescriptions[page]}
                    </p>
                </div>

                <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 capitalize">
                    {today}
                </div>
            </div>
        </header>
    );
}

export default Header;
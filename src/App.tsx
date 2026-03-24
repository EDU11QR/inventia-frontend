import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export type Page = "dashboard" | "products" | "sales" | "sales-history";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar page={page} setPage={setPage} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header page={page} />

          <main className="flex-1 min-w-0 w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            {page === "dashboard" && <Dashboard />}
            {page === "products" && <Products />}
            {page === "sales" && <Sales />}
            {page === "sales-history" && <SalesHistory />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
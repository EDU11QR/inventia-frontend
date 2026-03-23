import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Sidebar from "./components/Sidebar";

type Page = "dashboard" | "products" | "sales" | "sales-history";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar page={page} setPage={setPage} />

      <main className="flex-1 p-6">
        {page === "dashboard" && <Dashboard />}
        {page === "products" && <Products />}
        {page === "sales" && <Sales />}
        {page === "sales-history" && <SalesHistory />}
      </main>
    </div>
  );
}

export default App;
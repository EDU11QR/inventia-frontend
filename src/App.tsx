import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function App() {
  const [page, setPage] = useState<"dashboard" | "products" | "sales">("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setPage("dashboard")}
          className={`px-4 py-2 rounded text-white ${page === "dashboard" ? "bg-indigo-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setPage("products")}
          className={`px-4 py-2 rounded text-white ${page === "products" ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
        >
          Productos
        </button>

        <button
          onClick={() => setPage("sales")}
          className={`px-4 py-2 rounded text-white ${page === "sales" ? "bg-green-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
        >
          Ventas
        </button>
      </div>

      {page === "dashboard" && <Dashboard />}
      {page === "products" && <Products />}
      {page === "sales" && <Sales />}
    </div>
  );
}

export default App;
import { useState } from "react";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function App() {
  const [page, setPage] = useState<"products" | "sales">("products");

  return (
    <div className="p-4">
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setPage("products")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Productos
        </button>

        <button
          onClick={() => setPage("sales")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ventas
        </button>
      </div>

      {page === "products" ? <Products /> : <Sales />}
    </div>
  );
}

export default App;
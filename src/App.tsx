import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

type Page = "dashboard" | "products" | "sales" | "sales-history";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Sidebar page={page} setPage={setPage} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header page={page} />
        <main className="flex-1 w-full min-w-0 p-4 md:p-6 overflow-x-hidden">

          {page === "dashboard" && <Dashboard />}
          {page === "products" && <Products />}
          {page === "sales" && <Sales />}
          {page === "sales-history" && <SalesHistory />}
        </main>
      </div>
    </div>
  );
}

export default App;
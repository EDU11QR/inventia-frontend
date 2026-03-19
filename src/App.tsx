import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>INVENTIA Dashboard 🚀</h1>

      {data ? (
        <div>
          <p>Total Revenue: {data.totalRevenue}</p>
          <p>Total Sales: {data.totalSales}</p>
          <p>Today Sales: {data.todaySales}</p>
          <p>Low Stock: {data.lowStockProducts}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default App;
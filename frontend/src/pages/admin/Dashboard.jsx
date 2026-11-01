import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../../api.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import ProductImage from "../../components/ProductImage.jsx";

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api("/admin/stats").then(setS).catch(() => {}); }, []);
  if (!s) return <LoadingState label="Loading dashboard" />;

  return (
    <>
      <div className="stats">
        <div className="stat"><small>Revenue</small><strong>{money(s.revenue)}</strong></div>
        <div className="stat"><small>Orders</small><strong>{s.orders}</strong></div>
        <div className="stat"><small>Products</small><strong>{s.products}</strong></div>
        <div className="stat"><small>Customers</small><strong>{s.users}</strong></div>
      </div>

      <div className="twocol">
        <section>
          <h3>Recent orders</h3>
          <table className="table">
            <tbody>
              {s.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-6).toUpperCase()}</Link></td>
                  <td>{o.user?.name}</td><td>{money(o.totalPrice)}</td><td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {s.recentOrders.length === 0 && <tr><td>No orders yet</td></tr>}
            </tbody>
          </table>
        </section>
        <section>
          <h3>Low stock</h3>
          <table className="table">
            <tbody>
              {s.lowStock.map((p) => (<tr key={p._id}><td className="admin-product-cell"><ProductImage product={p} size="thumb" /><span>{p.name}</span></td><td className={p.stock === 0 ? "error" : "warn"}>{p.stock} left</td></tr>))}
              {s.lowStock.length === 0 && <tr><td>All products are well stocked</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

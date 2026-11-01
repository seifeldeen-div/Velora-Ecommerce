import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingState from "../components/LoadingState.jsx";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api("/orders/mine").then(setOrders).catch(() => setOrders([])); }, []);

  if (!orders) return <LoadingState label="Loading your orders" />;
  if (orders.length === 0) return <div className="container pad center"><h1>No orders yet</h1><Link to="/products" className="btn">Start shopping</Link></div>;

  return (
    <div className="container pad">
      <h1>My orders</h1>
      <table className="table">
        <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>#{o._id.slice(-6).toUpperCase()}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
              <td>{money(o.totalPrice)}</td>
              <td><StatusBadge status={o.status} /></td>
              <td><Link to={`/orders/${o._id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

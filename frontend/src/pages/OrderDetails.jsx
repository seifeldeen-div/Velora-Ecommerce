import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api, money } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProductImage from "../components/ProductImage.jsx";

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const load = () => api(`/orders/${id}`).then(setOrder).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id]);

  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    try { setOrder(await api(`/orders/${id}/cancel`, { method: "PUT" })); } catch (e) { setError(e.message); }
  }

  if (error && !order) return <div className="container pad"><p className="error">{error}</p></div>;
  if (!order) return <LoadingState label="Loading order details" />;

  return (
    <div className="container pad">
      {location.state?.placed && <div className="success">🎉 Thank you! Your order was placed successfully.</div>}
      <Link to="/orders" className="back">← My orders</Link>
      <h1>Order #{order._id.slice(-6).toUpperCase()} <StatusBadge status={order.status} /></h1>
      <p>Placed on {new Date(order.createdAt).toLocaleString()} · Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Card"} · {order.isPaid ? "Paid" : "Not paid yet"}</p>
      {error && <p className="error">{error}</p>}

      <div className="cartgrid">
        <section>
          <table className="table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i._id}>
                  <td className="order-product-cell"><ProductImage product={i} size="thumb" /><span>{i.name}</span></td><td>{money(i.price)}</td><td>{i.qty}</td><td>{money(i.price * i.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="summary">
          <h3>Shipping to</h3>
          <p>{order.shipping.fullName}<br />{order.shipping.address}, {order.shipping.city}<br />{order.shipping.phone}</p>
          <hr />
          <div className="sumrow"><span>Items</span><span>{money(order.itemsPrice)}</span></div>
          <div className="sumrow"><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : money(order.shippingPrice)}</span></div>
          <div className="sumrow total"><span>Total</span><span>{money(order.totalPrice)}</span></div>
          {order.status === "pending" && <button className="btn danger full" onClick={cancel}>Cancel order</button>}
        </aside>
      </div>
    </div>
  );
}

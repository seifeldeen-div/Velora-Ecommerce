import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { money } from "../api.js";

export default function Cart() {
  const { items, setQty, remove, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container pad center">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container pad cartgrid">
      <section>
        <h1>Shopping cart</h1>
        {items.map((i) => (
          <div key={i.productId} className="cartrow">
            <ProductImage product={i} size="thumb" />
            <div className="grow">
              <Link to={`/products/${i.productId}`}><strong>{i.name}</strong></Link>
              <div>{money(i.price)}</div>
            </div>
            <input type="number" min="1" max={i.stock} value={i.qty}
              onChange={(e) => setQty(i.productId, parseInt(e.target.value) || 1)} />
            <strong className="linetotal">{money(i.price * i.qty)}</strong>
            <button className="linkbtn danger" onClick={() => remove(i.productId)}>Remove</button>
          </div>
        ))}
      </section>

      <aside className="summary">
        <h3>Order summary</h3>
        <div className="sumrow"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="sumrow"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
        {shipping > 0 && <small>Add {money(100 - subtotal)} more for free shipping</small>}
        <div className="sumrow total"><span>Total</span><span>{money(total)}</span></div>
        <button className="btn full" onClick={() => navigate("/checkout")}>Proceed to checkout</button>
      </aside>
    </div>
  );
}

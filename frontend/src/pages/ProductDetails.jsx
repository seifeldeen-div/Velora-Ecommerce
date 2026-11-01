import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, money } from "../api.js";
import ProductImage from "../components/ProductImage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState([]);
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    api(`/products/${id}`).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setRelated([]);
    api(`/products?category=${encodeURIComponent(product.category)}&limit=5`)
      .then((data) => setRelated(data.products.filter((item) => item._id !== product._id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product]);

  if (error) return <div className="container pad"><p className="error">{error}</p><Link to="/products">Back to shop</Link></div>;
  if (!product) return <LoadingState label="Loading product details" />;

  const out = product.stock === 0;

  return (
    <>
      <div className="container pad">
        <Link to="/products" className="back">← Back to shop</Link>
        <div className="details">
          <ProductImage product={product} size="large" />
          <div>
            <span className="tag">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="rating">★ {product.rating.toFixed(1)}</div>
            <p className="price">{money(product.price)}</p>
            <p>{product.description}</p>
            <p className={out ? "error" : product.stock <= 5 ? "warn" : "ok"}>
              {out ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left!` : "In stock"}
            </p>
            {!out && (
              <div className="qtyrow">
                <input type="number" min="1" max={product.stock} value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} />
                <button className="btn" onClick={() => { add(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}>
                  {added ? "Added ✓" : "Add to cart"}
                </button>
                <button className="btn outline" onClick={() => { add(product, qty); navigate("/cart"); }}>Buy now</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="container section-block">
            <div className="section-heading">
              <div><span className="eyebrow">MORE TO LOVE</span><h2>More from {product.category}<span className="heading-period">.</span></h2></div>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-link">Explore category <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="grid">{related.map((item) => <ProductCard key={item._id} product={item} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}

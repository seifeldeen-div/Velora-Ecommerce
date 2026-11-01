import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { money } from "../api.js";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const cardRef = useRef(null);
  const out = product.stock === 0;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!("IntersectionObserver" in window)) {
      card.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        card.classList.add("is-visible");
        observer.unobserve(card);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pcard" ref={cardRef}>
      <Link to={`/products/${product._id}`} className="product-visual">
        <ProductImage product={product} />
        <span className="quick-view" aria-hidden="true">View item ↗</span>
      </Link>
      <div className="pbody">
        <div className="product-overline"><span className="tag">{product.category}</span><span className="rating">★ {product.rating.toFixed(1)}</span></div>
        <Link to={`/products/${product._id}`} className="pname">{product.name}</Link>
        <div className="prow">
          <strong>{money(product.price)}</strong>
          <button className="add-button" aria-label={out ? `${product.name} is sold out` : `Add ${product.name} to bag`} disabled={out} onClick={() => add(product, 1)}>
            {out ? "Sold out" : <><span>Add to bag</span><span aria-hidden="true">+</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import LoadingState from "../components/LoadingState.jsx";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], page: 1, pages: 1, total: 0 });
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [min, setMin] = useState(params.get("minPrice") || "");
  const [max, setMax] = useState(params.get("maxPrice") || "");

  const qs = params.toString();
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "newest";
  const page = parseInt(params.get("page")) || 1;

  useEffect(() => { api("/products/categories").then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    api(`/products?${qs}&limit=12`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [qs]);

  useEffect(() => {
    setMin(params.get("minPrice") || "");
    setMax(params.get("maxPrice") || "");
  }, [qs]);

  function update(changes) {
    const p = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v === "" || v == null ? p.delete(k) : p.set(k, v)));
    if (!("page" in changes)) p.delete("page"); // any filter change goes back to page 1
    setParams(p);
  }

  return (
    <div className="container pad shopgrid">
      <aside className="sidebar">
        <h3>Categories</h3>
        <button className={`side ${!category ? "on" : ""}`} onClick={() => update({ category: "" })}>All</button>
        {cats.map((c) => (
          <button key={c.name} className={`side ${category === c.name ? "on" : ""}`} onClick={() => update({ category: c.name })}>
            {c.name} <small>({c.count})</small>
          </button>
        ))}
        <h3>Price</h3>
        <div className="pricebox">
          <input type="number" min="0" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
          <input type="number" min="0" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
        <button className="btn small full" onClick={() => update({ minPrice: min, maxPrice: max })}>Apply</button>
      </aside>

      <section>
        <div className="toolbar">
          <div>
            <strong>{data.total}</strong> products
            {search && <> for “{search}”</>}
            {category && <> in {category}</>}
          </div>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {loading ? <LoadingState label="Finding your next favorite" variant="grid" /> : data.products.length === 0 ? <p className="empty">No products found.</p> : (
          <div className="grid">{data.products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}

        {data.pages > 1 && (
          <div className="pager">
            <button className="btn small" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
            <span>Page {data.page} of {data.pages}</span>
            <button className="btn small" disabled={page >= data.pages} onClick={() => update({ page: page + 1 })}>Next</button>
          </div>
        )}
      </section>
    </div>
  );
}

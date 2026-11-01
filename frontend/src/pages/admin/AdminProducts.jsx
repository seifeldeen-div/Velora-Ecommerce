import { useEffect, useState } from "react";
import { api, money } from "../../api.js";
import ProductImage from "../../components/ProductImage.jsx";

const EMPTY = { name: "", description: "", price: "", category: "", emoji: "🛍️", image: "", stock: "", featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null); // null = hidden
  const [error, setError] = useState("");

  const load = () => api("/products?limit=50&sort=newest").then((d) => setProducts(d.products)).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    setError("");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    delete body._id; delete body.createdAt; delete body.updatedAt; delete body.__v;
    try {
      if (form._id) await api(`/products/${form._id}`, { method: "PUT", body });
      else await api("/products", { method: "POST", body });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await api(`/products/${p._id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="toolbar">
        <h3>Products ({products.length})</h3>
        <button className="btn small" onClick={() => setForm({ ...EMPTY })}>+ New product</button>
      </div>

      {form && (
        <form className="adminform" onSubmit={save}>
          <h3>{form._id ? "Edit product" : "New product"}</h3>
          {error && <p className="error">{error}</p>}
          <div className="formgrid">
            <label>Name<input required value={form.name} onChange={set("name")} /></label>
            <label>Category<input required value={form.category} onChange={set("category")} /></label>
            <label>Price ($)<input required type="number" min="0" step="0.01" value={form.price} onChange={set("price")} /></label>
            <label>Stock<input required type="number" min="0" value={form.stock} onChange={set("stock")} /></label>
            <label>Emoji<input value={form.emoji} onChange={set("emoji")} /></label>
            <label>Image URL (optional)<input value={form.image} onChange={set("image")} /></label>
            <label className="span2">Description<textarea rows="3" value={form.description} onChange={set("description")} /></label>
            <label className="radio"><input type="checkbox" checked={form.featured} onChange={set("featured")} /> Featured on home page</label>
          </div>
          <button className="btn small">Save</button>{" "}
          <button type="button" className="btn small outline" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}

      <table className="table">
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="admin-product-cell"><ProductImage product={p} size="thumb" /><span>{p.name} {p.featured && <span className="tag">featured</span>}</span></td>
              <td>{p.category}</td><td>{money(p.price)}</td>
              <td className={p.stock === 0 ? "error" : p.stock <= 5 ? "warn" : ""}>{p.stock}</td>
              <td>
                <button className="linkbtn" onClick={() => { setError(""); setForm({ ...p }); window.scrollTo(0, 0); }}>Edit</button>{" "}
                <button className="linkbtn danger" onClick={() => remove(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

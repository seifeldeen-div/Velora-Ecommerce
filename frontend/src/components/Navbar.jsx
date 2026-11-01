import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import BrandLogo from "./BrandLogo.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function search(e) {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  }

  function signOut() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="announcement">
        <span>Complimentary shipping on orders over $100</span>
        <span className="announcement-note">A little more joy, delivered.</span>
      </div>
      <div className="container navin">
        <BrandLogo onClick={() => setMenuOpen(false)} />
        <form onSubmit={search} className="searchbar" role="search">
          <span aria-hidden="true" className="search-icon">⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find something lovely..." aria-label="Search products" />
          <button className="search-submit" aria-label="Submit search">↗</button>
        </form>
        <nav className={`navlinks ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>Bag{count > 0 && <span className="cart-count">{count}</span>}</NavLink>
          {user ? (
            <>
              <NavLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</NavLink>
              {user.isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="linkbtn" onClick={signOut}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Log in</NavLink>
              <NavLink to="/register" className="nav-cta" onClick={() => setMenuOpen(false)}>Create account <span aria-hidden="true">↗</span></NavLink>
            </>
          )}
        </nav>
        <button className={`menu-toggle ${menuOpen ? "is-open" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span>
        </button>
      </div>
    </header>
  );
}

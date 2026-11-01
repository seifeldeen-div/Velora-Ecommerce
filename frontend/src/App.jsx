import { Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import BrandLogo from "./components/BrandLogo.jsx";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="page" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          <Route path="*" element={<div className="container pad center not-found"><span className="eyebrow">Looks like a wrong turn</span><h1>404</h1><p>We couldn't find that page.</p><Link to="/" className="btn">Back to home <span aria-hidden="true">↗</span></Link></div>} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-main">
          <section className="footer-brand">
            <BrandLogo />
            <p>Thoughtful finds for everyday living. Discover useful, well-loved pieces across the things you do every day.</p>
            <div className="footer-socials" aria-label="Social media">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="social-dot" cx="18" cy="6" r="1" /></svg>
              </a>
              <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-3.28 17.38c-.02-.67 0-1.47.17-2.2l1.18-5s-.3-.6-.3-1.48c0-1.39.8-2.43 1.8-2.43.85 0 1.26.64 1.26 1.4 0 .85-.55 2.12-.84 3.3-.24.99.5 1.8 1.48 1.8 1.77 0 3.13-1.87 3.13-4.58 0-2.39-1.71-4.06-4.15-4.06-2.83 0-4.5 2.13-4.5 4.33 0 .86.33 1.79.74 2.29.08.1.1.18.07.28l-.27 1.1c-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.14 2.28-6.03 6.58-6.03 3.45 0 6.14 2.46 6.14 5.75 0 3.43-2.16 6.2-5.15 6.2-1.01 0-1.96-.53-2.29-1.15l-.62 2.35c-.22.86-.83 1.94-1.24 2.6A9 9 0 1 0 12 3Z" /></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37V9.6H7.15v3.2H10V21h3.5Z" /></svg>
              </a>
            </div>
          </section>

          <section className="footer-column">
            <h2>Explore</h2>
            <Link to="/products">Shop all</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Home">Home & living</Link>
            <Link to="/products?category=Books">Books & more</Link>
            <Link to="/products?category=Sports">Sports & outdoors</Link>
          </section>

          <section className="footer-column">
            <h2>Customer care</h2>
            <Link to="/orders">My orders</Link>
            <Link to="/cart">Shopping bag</Link>
            <Link to="/login">Your account</Link>
            <Link to="/products">Help choosing a product</Link>
          </section>

          <section className="footer-column footer-support">
            <h2>Here to help</h2>
            <p>Manage an order or cancel an order while it’s still pending.</p>
            <Link to="/orders" className="footer-contact-link">Go to order support <span aria-hidden="true">↗</span></Link>
            <div className="footer-payment">
              <span>PAYMENT</span>
              <span className="payment-pill">CASH ON DELIVERY</span>
              <span className="payment-pill">CARD*</span>
            </div>
          </section>
        </div>

        <div className="container footer-policies">
          <a href="#shipping-policy">Shipping</a>
          <a href="#returns-policy">Returns & cancellations</a>
          <a href="#privacy-policy">Privacy</a>
          <a href="#terms-policy">Terms</a>
          <div className="footer-policy-details">
            <details id="shipping-policy"><summary>Shipping information</summary><p>Shipping is $10 on orders under $100 and free on orders of $100 or more.</p></details>
            <details id="returns-policy"><summary>Returns & cancellations</summary><p>Pending orders can be cancelled from My Orders. This demo does not provide a return or refund workflow.</p></details>
            <details id="privacy-policy"><summary>Privacy notice</summary><p>Sign-in and cart state are stored in your browser. Card payments are simulated; no card payment is processed by this demo.</p></details>
            <details id="terms-policy"><summary>Terms of use</summary><p>Product availability and order status are provided by the live store API. Card checkout is a demonstration only.</p></details>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <small>© {new Date().getFullYear()} Velora. All rights reserved.</small>
            <span>Thoughtfully picked. Made for everyday.</span>
            <small>*Card payments are simulated</small>
          </div>
        </div>
      </footer>
    </>
  );
}

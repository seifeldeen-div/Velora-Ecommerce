import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="container pad">
      <h1>Admin panel</h1>
      <div className="tabs">
        <NavLink end to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </div>
      <Outlet />
    </div>
  );
}

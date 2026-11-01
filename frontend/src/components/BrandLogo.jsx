import { Link } from "react-router-dom";

export default function BrandLogo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="none">
          <path d="M22 5.5c-6.2 4.1-9 9-7.5 14.1 1 3.2 3.7 5.9 7.5 8 3.8-2.1 6.5-4.8 7.5-8C31 14.5 28.2 9.6 22 5.5Z" />
          <path d="M24.1 23.1c5.8-1.6 11.1.4 14.4 6.7-5.8 4.7-11.4 5.3-15.5 1.9" />
          <path d="M19.9 23.1c-5.8-1.6-11.1.4-14.4 6.7 5.8 4.7 11.4 5.3 15.5 1.9" />
          <path d="M22 14.5v21" />
        </svg>
      </span>
      <span className="logo-word">Velora</span>
    </Link>
  );
}

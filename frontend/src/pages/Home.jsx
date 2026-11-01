import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { getCategoryImage, HERO_IMAGE } from "../productImages.js";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    api("/products?featured=true&limit=8").then((d) => setFeatured(d.products)).catch(() => {});
    api("/products/categories").then(setCats).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot"></span> THE GOOD THINGS, FOUND</span>
            <h1>Everyday, <em>elevated.</em></h1>
            <p>Considered pieces for the way you live, work, and unwind. Find your next favorite thing.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn big">Explore the collection <span aria-hidden="true">↗</span></Link>
              <span className="hero-note">Thoughtful picks. Better everyday.</span>
            </div>
            <div className="hero-proof"><span className="proof-stars">✳</span><span>Thoughtful picks across every part of life</span></div>
          </div>
          <div className="hero-art" aria-label="Featured collection">
            <img className="hero-lifestyle-image" src={HERO_IMAGE} alt="A thoughtfully curated shop interior" loading="eager" onError={(event) => event.currentTarget.remove()} />
            <div className="hero-image-note"><span>THE EVERYDAY EDIT</span><strong>Find your new favorite.</strong></div>
            <div className="hero-sticker"><span>FIND</span><strong>YOUR<br />FAVORITE</strong><span>THING ↗</span></div>
            <div className="hero-art-caption"><span>01 / THE EDIT</span><span>OBJECTS FOR GOOD LIVING</span></div>
          </div>
        </div>
      </section>

      <section className="container section-block category-section">
        <div className="section-heading">
          <div><span className="eyebrow">A PLACE FOR EVERY INTEREST</span><h2>Shop by category<span className="heading-period">.</span></h2></div>
          <Link to="/products" className="text-link">View everything <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="catgrid">
          {cats.map((c) => (
            <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="catcard">
              {getCategoryImage(c.name) && <img className="category-image" src={getCategoryImage(c.name)} alt="" loading="lazy" onError={(event) => event.currentTarget.remove()} />}
              <span className="category-image-shade" aria-hidden="true"></span>
              <span className="catcard-meta"><strong>{c.name}</strong><small>{c.count} pieces</small></span>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="container section-block">
          <div className="section-heading">
            <div><span className="eyebrow">CURATED FOR YOU</span><h2>Worth a closer look<span className="heading-period">.</span></h2></div>
            <Link to="/products" className="text-link">Shop all products <span aria-hidden="true">↗</span></Link>
          </div>
        <div className="grid">{featured.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </div>
      </section>

      <section className="editorial-promo">
        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85" alt="Warm, considered details in a modern living space" loading="lazy" onError={(event) => event.currentTarget.remove()} />
        <div className="editorial-promo-content">
          <span className="eyebrow">MAKE ROOM FOR THE GOOD</span>
          <h2>Small details.<br /><em>Better days.</em></h2>
          <p>From a softer landing at home to the tools that keep you moving, discover pieces that make everyday feel a little more considered.</p>
          <Link to="/products?category=Home" className="btn">Explore home <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="container values-section">
        <div className="values-intro"><span className="eyebrow">THE VELORA DIFFERENCE</span><h2>Good from the<br /><em>first click.</em></h2></div>
        <div className="perks">
          <div><span className="perk-icon">↗</span><strong>At your door, sooner</strong><small>Free shipping when your order tops $100.</small></div>
          <div><span className="perk-icon">◇</span><strong>Checkout, worry-free</strong><small>A simple and secure way to shop.</small></div>
          <div><span className="perk-icon">↶</span><strong>Plans can change</strong><small>Cancel pending orders whenever you need.</small></div>
        </div>
      </section>
    </>
  );
}

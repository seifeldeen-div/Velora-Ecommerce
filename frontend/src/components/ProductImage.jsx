import { useEffect, useState } from "react";
import { getCategoryImage, getProductImage } from "../productImages.js";

export default function ProductImage({ product, size = "card" }) {
  const [unavailable, setUnavailable] = useState(false);
  const primaryImage = getProductImage(product);
  const fallbackImage = getCategoryImage(product.category);
  const [src, setSrc] = useState(primaryImage);

  useEffect(() => {
    setSrc(primaryImage);
    setUnavailable(false);
  }, [primaryImage]);

  function handleError() {
    if (src !== fallbackImage && fallbackImage) {
      setSrc(fallbackImage);
      return;
    }
    setUnavailable(true);
  }

  if (unavailable || !src) {
    return <div className={`pimg image-unavailable ${size}`} role="img" aria-label={`${product.name} image unavailable`} />;
  }

  return (
    <img
      className={`pimg ${size}`}
      src={src}
      alt={product.name}
      loading={size === "large" ? "eager" : "lazy"}
      onError={handleError}
    />
  );
}

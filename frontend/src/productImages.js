const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=85`;

export const PRODUCT_IMAGES = {
  "wireless headphones": photo("photo-1505740420928-5e560c06d30e"),
  "smart watch": photo("photo-1523275335684-37898b6baf30"),
  'laptop 15"': photo("photo-1496181133206-80ce9b88a853"),
  "mechanical keyboard": photo("photo-1587829741301-dc798b83add3"),
  "bluetooth speaker": photo("photo-1608043152269-423dbba4e7e1"),
  "classic sneakers": photo("photo-1542291026-7eec264c27ff"),
  "denim jacket": photo("photo-1543076447-215ad9ba6923"),
  "leather backpack": photo("photo-1553062407-98eeb64c6a62"),
  sunglasses: photo("photo-1511499767150-a48a237f0083"),
  "coffee maker": photo("photo-1495474472287-4d71bcdd2085"),
  "desk lamp": photo("photo-1507473885765-e6ed057f782c"),
  "scented candle set": photo("photo-1603006905003-be475563bc59"),
  "cozy blanket": photo("photo-1600369671236-e74521d4b6ad"),
  "learn docker in a month": photo("photo-1544947950-fa07a98d237f"),
  "clean code": photo("photo-1512820790803-83ca734da794"),
  "notebook pack (3)": photo("photo-1531346878377-a5be20888e57"),
  "yoga mat": photo("photo-1592432678016-e910b452f9a2"),
  football: photo("photo-1579952363873-27f3bade9f55"),
  "dumbbell set": photo("photo-1583454110551-21f2fa2afe61"),
  "water bottle": photo("photo-1602143407151-7111542de6e8"),
};

export const CATEGORY_IMAGES = {
  Electronics: PRODUCT_IMAGES["wireless headphones"],
  Fashion: PRODUCT_IMAGES["classic sneakers"],
  Home: PRODUCT_IMAGES["coffee maker"],
  Books: PRODUCT_IMAGES["learn docker in a month"],
  Sports: PRODUCT_IMAGES["yoga mat"],
};

export const HERO_IMAGE = photo("photo-1616486338812-3dadae4b4ace");

export function getProductImage(product) {
  if (product.image) return product.image;
  return PRODUCT_IMAGES[product.name?.trim().toLowerCase()] ||
    CATEGORY_IMAGES[product.category] ||
    "";
}

export function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || "";
}

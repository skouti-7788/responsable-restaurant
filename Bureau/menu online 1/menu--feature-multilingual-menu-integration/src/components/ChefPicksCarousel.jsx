import { ChefHat } from "lucide-react";
import FoodImage from "./FoodImage";
import { formatPrice } from "./Constants";

/* --------------------------- ChefPicksCarousel ------------------------------ */
export default function ChefPicksCarousel({ items, onOpen, t }) {
  // console.log("ChefPicksCarousel items:", items);
  if (items.length === 0) return null;
  return (
    <div className="picks-section" aria-label={t?.chefPicks || "Chef's Picks"}>
      <div className="picks-eyebrow">
        <ChefHat size={14} strokeWidth={2} />
        <span>{t?.chefPicks || "Chef's Picks"}</span>
      </div>
      <div className="picks-scroller">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className="pick-card"
            onClick={() => onOpen(item)}
          >
            <FoodImage src={item.image_url || item.image} alt={item.name} className="pick-card-img" />
            <div className="pick-card-shade" />
            <div className="pick-card-info">
              <span className="pick-card-name">{item.name}</span>
              <span className="pick-card-price">{formatPrice(item.price,t)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
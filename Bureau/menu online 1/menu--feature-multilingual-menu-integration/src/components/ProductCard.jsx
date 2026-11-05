import { Plus } from "lucide-react";
import FoodImage from "./FoodImage";
// import TagRow from "./TagRow";
import { formatPrice } from "./Constants";

/* ------------------------------ ProductCard -------------------------------- */
export default function ProductCard({ item, qtyInCart, onOpen, onQuickAdd, index, t }) {
  // console.log("ProductCard item:", item);
  return (
    <div
      className="product-card"
      style={{ "--stagger": Math.min(index, 8) }}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      <div className="product-card-media">
        <FoodImage src={item.image_url || item.image} alt={item.name} className="product-card-img" />
        {qtyInCart > 0 && <span className="qty-pill">{qtyInCart}</span>}
      </div>
      <div className="product-card-body">
        <div>
          <h3 className="product-card-name">{item.name}</h3>
          <p className="product-card-desc">{item.description}</p>
          {/* <TagRow tags={item.tags} /> */}
        </div>
        <div className="product-card-footer">
          <span className="price-chit">{formatPrice(item.price,t)}</span>
          <button
            type="button"
            className="add-btn"
            aria-label={t?.addToOrderItem ? `${t?.addToOrderItem} ${item.name}` : `Add ${item.name} to order`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
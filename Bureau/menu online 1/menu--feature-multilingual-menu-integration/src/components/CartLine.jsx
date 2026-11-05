import { X, Minus, Plus } from "lucide-react";
import FoodImage from "./FoodImage";
import { formatPrice } from "./Constants";

/* -------------------------------- CartLine ---------------------------------- */
export default function CartLine({ line, onInc, onDec, onNotes, onRemove, t }) {
  return (
    <div className="cart-line">
      <FoodImage src={line.image} alt={line.name} className="cart-line-img" />
      <div className="cart-line-body">
        <div className="cart-line-top">
          <span className="cart-line-name">{line.name}</span>
          <button className="cart-line-remove" onClick={() => onRemove(line.id)} aria-label={t?.removeItem ? `${t?.removeItem} ${line.name}` : `Remove ${line.name}`}>
            <X size={14} />
          </button>
        </div>
        <input
          className="cart-line-notes"
          placeholder={t?.notePlaceholder || "Add a note…"}
          value={line.notes}
          onChange={(e) => onNotes(line.id, e.target.value)}
        />
        <div className="cart-line-bottom">
          <div className="stepper stepper-sm">
            <button onClick={() => onDec(line.id)} aria-label={t?.decreaseQtyFor ? `${t?.decreaseQtyFor} ${line.name}` : `Decrease ${line.name} quantity`}>
              <Minus size={13} />
            </button>
            <span>{line.qty}</span>
            <button onClick={() => onInc(line.id)} aria-label={t?.increaseQtyFor ? `${t?.increaseQtyFor} ${line.name}` : `Increase ${line.name} quantity`}>
              <Plus size={13} />
            </button>
          </div>
          <span className="cart-line-price">{formatPrice(line.price * line.qty,t)}</span>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { X, StickyNote, Minus, Plus } from "lucide-react";
import FoodImage from "./FoodImage";
// import TagRow from "./TagRow";
import { formatPrice } from "./Constants";

/* ------------------------------ ProductModal -------------------------------- */
export default function ProductModal({ item, onClose, onConfirm, t }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet product-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <div className="sheet-drag" />
        <button className="sheet-close" onClick={onClose} aria-label={t?.close || "Close"}>
          <X size={18} />
        </button>

        <FoodImage src={item.image} alt={item.name} className="modal-img" />

        <div className="sheet-content">
          {/* <TagRow tags={item.tags} /> */}
          <h2 className="modal-name">{item.name}</h2>
          <p className="modal-desc">{item.description}</p>

          <label className="notes-label" htmlFor="notes-field">
            <StickyNote size={13} strokeWidth={2} />
            {t?.specialNotes || "Special notes"}
          </label>
          <textarea
            id="notes-field"
            className="notes-field"
            placeholder={t?.notesPlaceholder || "e.g. without spicy sauce, allergy info…"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="modal-actions">
            <div className="stepper">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={t?.decreaseQty || "Decrease quantity"}
              >
                <Minus size={15} />
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label={t?.increaseQty || "Increase quantity"}
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => onConfirm(item, qty, notes)}
            >
              {t?.add || "Add to order"} &nbsp;·&nbsp; {formatPrice(item.price * qty,t)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Check, Truck } from "lucide-react";
import { ORDER_STAGES } from "./Constants";

/* ---------------------------- ConfirmationScreen ------------------------------ */
export default function ConfirmationScreen({ order, tableNumber, onBack, t }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, ORDER_STAGES.length - 1));
    }, 2600);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;
  const isDone = stageIndex >= ORDER_STAGES.length - 1;

  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <div className={`confirm-check ${isDone ? "confirm-check-done" : ""}`}>
          {isDone ? <Truck size={26} strokeWidth={2.4} /> : <Check size={28} strokeWidth={3} />}
        </div>
        <h2>{isDone ? t?.orderOnWay || "On its way to your table" : t?.orderSent || "Order sent to the kitchen"}</h2>
        <p className="confirm-sub">{t?.orderProgress || "Track your order's progress below."}</p>

        <div className="stage-tracker" role="list" aria-label="Order progress">
          {ORDER_STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const state =
              i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
            return (
              <div key={stage.key} className={`stage-item stage-${state}`} role="listitem">
                <div className="stage-dot">
                  <Icon size={13} strokeWidth={2.4} />
                </div>
                <span className="stage-label">{t?.[stage.labelKey] || stage.label}</span>
                {i < ORDER_STAGES.length - 1 && <span className="stage-line" />}
              </div>
            );
          })}
        </div>

        <div className="confirm-details">
          <div>
            <span className="confirm-label">{t?.order || "Order"}</span>
            <span className="mono">{order.id}</span>
          </div>
          <div>
            <span className="confirm-label">{t?.table || "Table"}</span>
            <span className="mono">{tableNumber}</span>
          </div>
          <div>
            <span className="confirm-label">{t?.estTime || "Est. time"}</span>
            <span className="mono">~{order.estimated_minutes} min</span>
          </div>
        </div>

        <button type="button" className="primary-btn wide" onClick={onBack}>
          {t?.back || "Back to menu"}
        </button>
      </div>
    </div>
  );
}
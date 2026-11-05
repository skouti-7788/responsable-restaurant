import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

/* ------------------------------ FoodImage -------------------------------- */
export default function FoodImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} img-fallback`}>
        <UtensilsCrossed size={18} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
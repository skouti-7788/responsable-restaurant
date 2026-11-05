import { TAG_META } from "./Constants";

/* -------------------------------- TagRow ---------------------------------- */
export default function TagRow({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="tag-row">
      {tags.map((t) => {
        const meta = TAG_META[t];
        if (!meta) return null;
        const Icon = meta.icon;
        return (
          <span key={t} className={`tag ${meta.cls}`}>
            <Icon size={11} strokeWidth={2} />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}
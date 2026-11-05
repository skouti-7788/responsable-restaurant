import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
// import { FILTERS } from "./Constants";
/* ------------------------------- CategoryTabs --------------------------------- */
export default function CategoryTabs({
  categories, active, onSelect, stuck,
  searchOpen, setSearchOpen, query, setQuery,
  // activeFilters, toggleFilter,
   t,restau,
}) {
   
   

  const inputRef = useRef(null);
  useEffect(() => {
     
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen  ]);
    
  const myCategories = restau?.categories ? categories : restau?.categories || [];
  // console.log(myCategories);
  return (
    <div className={`cat-tabs-wrap ${stuck ? "is-stuck" : ""}`}>
      <div className="cat-tabs-row">
        <div className="cat-tabs">
          {myCategories.map((c) => {
            // const Icon = c.icon  ;
            const isActive = c.key === active;
            return (
              <button
                key={c.id ||c.key}
                type="button"
                className={`cat-tab ${isActive ? "cat-tab-active" : ""}`}
                onClick={() => onSelect(c.key)}
              >
                {/* <Icon size={14} strokeWidth={2} /> */}
                {c.name || c.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={`search-toggle ${searchOpen ? "search-toggle-active" : ""}`}
          onClick={() => setSearchOpen((s) => !s)}
          aria-label={searchOpen ? t?.closeSearch || "Close search" : t?.searchMenu || "Search menu"}
        >
          {searchOpen ? <X size={16} /> : <Search size={16} />}
        </button>
      </div>

      {searchOpen && (
        <div className="search-row">
          <div className="search-field">
            <Search size={14} strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t?.search || "Search dishes, ingredients…"}
              aria-label={t?.search || "Search the menu"}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label={t?.clearSearch || "Clear search"}
              >
                <X size={13} />
              </button>
            )}
          </div>
          {/* <div className="filter-chips">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = activeFilters.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  className={`filter-chip ${isActive ? "filter-chip-active" : ""}`}
                  onClick={() => toggleFilter(f.key)}
                  aria-pressed={isActive}
                >
                  <Icon size={12} strokeWidth={2.2} />
                  {t?.[f.key] || f.label}
                </button>
              );
            })}
          </div>*/}
        </div> 
      )}
    </div>
  );
}
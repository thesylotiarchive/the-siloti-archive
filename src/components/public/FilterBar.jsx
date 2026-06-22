"use client";

import { useState, useEffect } from "react";

export default function FilterSidebar({ activeFilters, onChange }) {
  const [selected, setSelected] = useState(activeFilters);

  const filters = {
    mediaType: ["PDF", "IMAGE", "AUDIO", "VIDEO"],
    language: ["en", "bn", "syl"],
    // you can add tags dynamically if you want
  };

  useEffect(() => {
    setSelected(activeFilters);
  }, [activeFilters]);

  const handleCheckboxChange = (key, value) => {
    const currentValues = selected[key] || [];
    let updatedValues;

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((v) => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    const updated = { ...selected, [key]: updatedValues };
    setSelected(updated);
    onChange(updated);
  };

  return (
    <aside className="w-64 shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl h-fit text-slate-800 dark:text-white transition-all duration-300">
      <h2 className="text-lg font-bold tracking-wide mb-4">Filters</h2>

      {/* Media Type */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/55 font-bold mb-3">Media Type</h3>
        <ul className="space-y-2.5">
          {filters.mediaType.map((f) => (
            <li key={f} className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id={`mediaType-${f}`}
                checked={selected.mediaType?.includes(f)}
                onChange={() => handleCheckboxChange("mediaType", f)}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/20 bg-white dark:bg-slate-950 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer accent-emerald-500 transition-colors duration-300"
              />
              <label htmlFor={`mediaType-${f}`} className="text-sm text-slate-600 dark:text-white/85 cursor-pointer select-none font-medium hover:text-slate-900 hover:dark:text-white transition-colors duration-150">
                {f}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}


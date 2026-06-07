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
    <aside className="w-64 shrink-0 border border-white/10 bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl h-fit text-white">
      <h2 className="text-lg font-bold tracking-wide mb-4">Filters</h2>

      {/* Media Type */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-widest text-white/55 font-bold mb-3">Media Type</h3>
        <ul className="space-y-2.5">
          {filters.mediaType.map((f) => (
            <li key={f} className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id={`mediaType-${f}`}
                checked={selected.mediaType?.includes(f)}
                onChange={() => handleCheckboxChange("mediaType", f)}
                className="w-4 h-4 rounded border-white/20 bg-slate-950 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer accent-emerald-500"
              />
              <label htmlFor={`mediaType-${f}`} className="text-sm text-white/85 cursor-pointer select-none font-medium hover:text-white transition-colors duration-150">
                {f}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Language */}
      {/* <div>
        <h3 className="text-sm font-medium mb-3">Language</h3>
        <ul className="space-y-2">
          {filters.language.map((lang) => (
            <li key={lang} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`language-${lang}`}
                checked={selected.language?.includes(lang)}
                onChange={() => handleCheckboxChange("language", lang)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`language-${lang}`} className="text-sm">
                {lang}
              </label>
            </li>
          ))}
        </ul>
      </div> */}
    </aside>
  );
}

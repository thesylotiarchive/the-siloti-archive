"use client";

export default function CardWrapper({ children }) {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[5/4] flex">
      {/* Force children to stretch and align */}
      <div className="w-full flex flex-col">{children}</div>
    </div>
  );
}

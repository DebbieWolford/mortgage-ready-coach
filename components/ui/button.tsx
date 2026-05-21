import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: any) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition px-4 py-2";

  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900"
      : "bg-slate-900 text-white";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">

      {/* LEFT: Hamburger */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 bg-white shadow-sm transition hover:shadow-md hover:bg-slate-50 active:scale-95"
        >
          <span className="text-lg text-slate-700">☰</span>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute left-0 mt-3 w-48 rounded-2xl border border-slate-300 bg-white shadow-lg overflow-hidden animate-fade-in">
            <Link
              href="/"
              className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Single Car
            </Link>

            <Link
              href="/compare"
              className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Compare Cars
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
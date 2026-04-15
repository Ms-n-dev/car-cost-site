"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-300 bg-white p-2 shadow-sm"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="mt-3 rounded-2xl border border-slate-300 bg-white shadow-md">
          <Link
            href="/"
            className="block px-4 py-3 hover:bg-slate-100"
          >
            Single Car
          </Link>

          <Link
            href="/compare"
            className="block px-4 py-3 hover:bg-slate-100"
          >
            Compare Cars
          </Link>
        </div>
      )}
    </div>
  );
}
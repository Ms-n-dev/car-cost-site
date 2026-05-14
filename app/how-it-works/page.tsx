import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CarCalc
          </Link>

          <Link
            href="/"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try calculator
          </Link>
        </header>

        <section className="py-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            How it works
          </p>

          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Find out what a car could really cost you.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            CarCalc estimates the true cost of owning or financing a car by
            combining purchase method, running costs, mileage and depreciation.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "1. Choose the car",
              text: "Enter a registration or pick the make and model manually.",
            },
            {
              title: "2. Choose how you’re buying",
              text: "Select cash or finance so the calculation matches your situation.",
            },
            {
              title: "3. Add running costs",
              text: "Insurance, fuel, tax, servicing, tyres and repair buffers all feed into the result.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-500">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Why it matters
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            A monthly finance payment is only part of the story. Fuel,
            insurance, tax, maintenance and depreciation can completely change
            whether a car is actually affordable over 2, 3 or 4 years.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-slate-950"
          >
            Calculate a car
          </Link>
        </section>
      </div>
    </main>
  );
}
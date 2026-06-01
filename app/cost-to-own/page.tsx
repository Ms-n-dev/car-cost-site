import Link from "next/link";
import { costToOwnCars } from "@/data/costToOwnCars";

export const metadata = {
  title: "UK Car Running Costs & Ownership Guides | CarCalc",
  description:
    "Browse UK car ownership cost guides covering fuel, insurance, servicing, repairs, reliability and depreciation.",
};

export default function CostToOwnIndexPage() {
  const cars = Object.entries(costToOwnCars);

  const popularSlugs = [
    "bmw-m140i",
    "bmw-m340i",
    "audi-rs3",
    "golf-r-mk75",
    "tesla-model-3",
    "bmw-330d",
  ];

const popularCars = popularSlugs.flatMap((slug) => {
  const car = costToOwnCars[slug as keyof typeof costToOwnCars];

  if (!car) return [];

  return [[slug, car] as const];
});

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Ownership guides
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            UK Car Running Cost Guides
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Compare real-world ownership costs for popular UK cars including
            fuel, insurance, servicing, repairs, reliability and depreciation.
            Browse detailed guides covering BMW, Audi, Mercedes, Tesla,
            Porsche, Toyota and more.
          </p>

          <p className="mt-6 text-slate-300">
            Looking for your exact ownership costs?{" "}
            <Link href="/v2" className="font-semibold text-white underline">
              Use the free CarCalc calculator.
            </Link>
          </p>
        </section>

        {popularCars.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold">Most popular guides</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularCars.map(([slug, car]) => (
                <Link
                  key={slug}
                  href={`/cost-to-own/${slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-950">
                    {car.name} Running Costs
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Fuel, insurance, maintenance, depreciation and ownership
                    costs.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {car.year}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 capitalize">
                      {car.fuelType.replace("_", " ")}
                    </span>
                    {car.fuelType !== "electric" && (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {car.mpg} mpg
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-bold">All ownership cost guides</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cars.map(([slug, car]) => (
              <Link
                key={slug}
                href={`/cost-to-own/${slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-950">
                  {car.name} Running Costs
                </h3>

                <p className="mt-2 text-sm text-slate-600 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                  {car.intro}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {car.year}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 capitalize">
                    {car.fuelType.replace("_", " ")}
                  </span>
                  {car.fuelType !== "electric" && (
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {car.mpg} mpg
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
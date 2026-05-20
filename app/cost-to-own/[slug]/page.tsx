import Link from "next/link";
import { notFound } from "next/navigation";
import { costToOwnCars } from "@/data/costToOwnCars";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function estimateFuelCost(mpg: number, annualMiles = 8000, fuelPrice = 150) {
  return (annualMiles / mpg) * 4.54609 * (fuelPrice / 100);
}

export async function generateStaticParams() {
  return Object.keys(costToOwnCars).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = costToOwnCars[slug as keyof typeof costToOwnCars];

  if (!car) return {};

  return {
    title: `${car.name} Running Costs | CarCalc`,
    description: `Estimate the real cost to own a ${car.name}, including fuel, insurance, tax, servicing, tyres, repairs and depreciation.`,
  };
}

export default async function CostToOwnPage({ params }: Props) {
  const { slug } = await params;
  const car = costToOwnCars[slug as keyof typeof costToOwnCars];

  if (!car) notFound();

  const annualMiles = 8000;
  const ownershipYears = 3;
  const fuelCost = estimateFuelCost(car.mpg, annualMiles);
  const maintenance = car.servicing + car.tyres + car.repairs;
  const yearlyRunningCost =
    fuelCost + car.insurance + car.tax + maintenance;

  const depreciation = car.price * 0.35;
  const totalThreeYearCost =
    yearlyRunningCost * ownershipYears + depreciation;

  const monthlyCost = totalThreeYearCost / 36;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← Back to calculator
        </Link>

        <section className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Cost to own
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {car.name} running costs
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Estimate what a {car.name} could really cost to own, including fuel,
            insurance, tax, servicing, tyres, repairs and depreciation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm text-slate-400">Estimated monthly cost</div>
              <div className="mt-2 text-3xl font-bold">
                {money(monthlyCost)}
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm text-slate-400">3-year cost</div>
              <div className="mt-2 text-3xl font-bold">
                {money(totalThreeYearCost)}
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm text-slate-400">Typical MPG</div>
              <div className="mt-2 text-3xl font-bold">
                {car.mpg}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Estimated yearly running costs
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Fuel</span>
                <strong>{money(fuelCost)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Insurance</span>
                <strong>{money(car.insurance)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <strong>{money(car.tax)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Servicing</span>
                <strong>{money(car.servicing)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Tyres</span>
                <strong>{money(car.tyres)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Repairs buffer</span>
                <strong>{money(car.repairs)}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Is the {car.name} expensive to run?
            </h2>

            <p className="mt-4 text-slate-600">
              A {car.name} is likely to cost around{" "}
              <strong>{money(monthlyCost)} per month</strong> over 3 years,
              based on {annualMiles.toLocaleString()} miles per year. The biggest
              costs are usually depreciation, insurance, fuel and maintenance.
            </p>

            <Link
              href="/v2"
              className="mt-6 block rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white"
            >
              Calculate your exact cost
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
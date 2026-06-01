import Link from "next/link";
import { notFound } from "next/navigation";
import { costToOwnCars } from "@/data/costToOwnCars";
import { costComparisons } from "@/data/costComparisons";
import { calculateCarCosts } from "@/lib/CalculateCarCosts";

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

export async function generateStaticParams() {
  return Object.keys(costComparisons).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const comparison =
    costComparisons[slug as keyof typeof costComparisons];

  if (!comparison) return {};

  return {
    title: `${comparison.title} UK | CarCalc`,
    description: `Compare ${comparison.title.toLowerCase()} including fuel, insurance, maintenance, depreciation and monthly ownership costs.`,
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison =
    costComparisons[slug as keyof typeof costComparisons];

  if (!comparison) notFound();

  const car1 =
    costToOwnCars[comparison.car1Slug as keyof typeof costToOwnCars];
  const car2 =
    costToOwnCars[comparison.car2Slug as keyof typeof costToOwnCars];

  if (!car1 || !car2) notFound();
const intro =
  "intro" in comparison
    ? comparison.intro
    : `${car1.name} and ${car2.name} are two popular UK used cars that are often compared by buyers. This page compares their estimated ownership costs including fuel, insurance, maintenance and depreciation.`;

const verdict =
  "verdict" in comparison
    ? comparison.verdict
    : `The cheaper car to own will depend on purchase price, mileage, fuel costs, insurance and depreciation. Use the figures below as a guide, then run your own calculation based on your mileage and ownership period.`;

const faq: { question: string; answer: string }[] =
  "faq" in comparison
    ? comparison.faq
    : [
        {
          question: `Is the ${car1.name} cheaper to run than the ${car2.name}?`,
          answer:
            "The cheaper car depends on mileage, fuel costs, insurance, maintenance and depreciation. The comparison above estimates the total ownership cost over three years.",
        },
        {
          question: `Which has lower fuel costs, the ${car1.name} or ${car2.name}?`,
          answer:
            "Fuel costs depend on real-world efficiency, fuel type and annual mileage. Diesel and electric cars may be cheaper to run for high-mileage drivers, while performance petrol cars usually cost more to fuel.",
        },
        {
          question: `Which car should I choose?`,
          answer:
            "Choose based on your budget, mileage, driving style and how much risk you are comfortable with around depreciation, maintenance and insurance.",
        },
      ];
  const annualMiles = 8000;
  const ownershipYears = 3;

  const car1Results = calculateCarCosts({
    carValue: car1.price,
    carYear: car1.year,
    annualMiles,
    currentMileage: car1.currentMileage,
    carType: car1.carType,
    fuelType: car1.fuelType,
    efficiency: car1.mpg,
    fuelPrice: car1.fuelPrice,
    insurance: car1.insurance,
    tax: car1.tax,
    servicing: car1.servicing,
    tyres: car1.tyres,
    repairsBuffer: car1.repairs,
    miscCosts: 0,
    ownershipYears,
  });

  const car2Results = calculateCarCosts({
    carValue: car2.price,
    carYear: car2.year,
    annualMiles,
    currentMileage: car2.currentMileage,
    carType: car2.carType,
    fuelType: car2.fuelType,
    efficiency: car2.mpg,
    fuelPrice: car2.fuelPrice,
    insurance: car2.insurance,
    tax: car2.tax,
    servicing: car2.servicing,
    tyres: car2.tyres,
    repairsBuffer: car2.repairs,
    miscCosts: 0,
    ownershipYears,
  });

  const cheaperCar =
    car1Results.totalCost < car2Results.totalCost ? car1 : car2;

  const difference = Math.abs(
    car1Results.totalCost - car2Results.totalCost
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <Link
              href="/cost-to-own"
              className="transition hover:text-slate-950"
            >
              ← Ownership guides
            </Link>

            <Link href="/" className="transition hover:text-slate-950">
              Use the calculator →
            </Link>
          </div>

          <section className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Running cost comparison
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              {comparison.title}
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              {intro}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-sm text-slate-400">{car1.name}</div>
                <div className="mt-2 text-3xl font-bold">
                  {money(car1Results.monthlyCost)}/mo
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {money(car1Results.totalCost)} over {ownershipYears} years
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-sm text-slate-400">{car2.name}</div>
                <div className="mt-2 text-3xl font-bold">
                  {money(car2Results.monthlyCost)}/mo
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {money(car2Results.totalCost)} over {ownershipYears} years
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">
              Which is cheaper to own?
            </h2>

            <p className="mt-4 text-slate-600">
              Based on {annualMiles.toLocaleString()} miles per year over{" "}
              {ownershipYears} years, the{" "}
              <strong>{cheaperCar.name}</strong> is estimated to be cheaper by
              around <strong>{money(difference)}</strong> over the ownership
              period.
            </p>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Cost breakdown</h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-4">Cost</th>
                    <th className="p-4">{car1.name}</th>
                    <th className="p-4">{car2.name}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 font-medium">Monthly cost</td>
                    <td className="p-4">{money(car1Results.monthlyCost)}</td>
                    <td className="p-4">{money(car2Results.monthlyCost)}</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Annual cost</td>
                    <td className="p-4">{money(car1Results.annualCost)}</td>
                    <td className="p-4">{money(car2Results.annualCost)}</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Fuel per year</td>
                    <td className="p-4">{money(car1Results.annualFuelCost)}</td>
                    <td className="p-4">{money(car2Results.annualFuelCost)}</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Insurance per year</td>
                    <td className="p-4">{money(car1.insurance)}</td>
                    <td className="p-4">{money(car2.insurance)}</td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Maintenance per year</td>
                    <td className="p-4">
                      {money(car1Results.annualMaintenance)}
                    </td>
                    <td className="p-4">
                      {money(car2Results.annualMaintenance)}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Depreciation per year</td>
                    <td className="p-4">
                      {money(car1Results.annualDepreciation)}
                    </td>
                    <td className="p-4">
                      {money(car2Results.annualDepreciation)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Verdict</h2>

            <p className="mt-4 text-slate-600">{verdict}</p>

            <Link
              href="/"
              className="mt-6 block rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white"
            >
              Compare your own cars
            </Link>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">FAQs</h2>

            <div className="mt-5 space-y-5">
              {faq.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-slate-950">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
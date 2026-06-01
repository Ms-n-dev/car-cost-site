import Link from "next/link";
import { notFound } from "next/navigation";
import { costToOwnCars } from "@/data/costToOwnCars";
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
  return Object.keys(costToOwnCars).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = costToOwnCars[slug as keyof typeof costToOwnCars];

  if (!car) return {};

  return {
    title: `${car.name} Running Costs UK | Fuel, Insurance & Maintenance`,
    description: `See estimated ${car.name} running costs in the UK, including fuel, insurance, road tax, servicing, tyres, repairs and depreciation.`,
  };
}

export default async function CostToOwnPage({ params }: Props) {
  const { slug } = await params;
  const car = costToOwnCars[slug as keyof typeof costToOwnCars];

  if (!car) notFound();


 const annualMiles = 8000;
const ownershipYears = 3;

const results = calculateCarCosts({
  carValue: car.price,
  carYear: car.year,
  annualMiles,
  currentMileage: car.currentMileage,
  carType: car.carType,
  fuelType: car.fuelType,
  efficiency: car.mpg,
  fuelPrice: car.fuelPrice,
  insurance: car.insurance,
  tax: car.tax,
  servicing: car.servicing,
  tyres: car.tyres,
  repairsBuffer: car.repairs,
  miscCosts: 0,
  ownershipYears,
});

const fuelCost = results.annualFuelCost;
const annualCost = results.annualCost;
const monthlyCost = results.monthlyCost;
const totalThreeYearCost = results.totalCost;
const depreciation = results.totalDepreciation;
  const relatedCars = Object.entries(costToOwnCars).filter(
  ([relatedSlug]) => relatedSlug !== slug
);
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: car.faq.map((item) => ({
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
    <div className="mx-auto max-w-4xl">

      <div className="flex items-center justify-between text-sm font-medium text-slate-500">
        <Link
          href="/cost-to-own"
          className="transition hover:text-slate-950"
        >
          ← All ownership guides
        </Link>

        <Link
          href="/v2"
          className="transition hover:text-slate-950"
        >
          Calculate your own costs →
        </Link>
      </div>

      <section className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          Cost to own
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          {car.name} Ownership Costs UK
        </h1>

        <p className="mt-4 text-2xl font-bold text-white sm:text-4xl">
          Around {money(monthlyCost)} per month to own
        </p>

        <p className="mt-4 max-w-2xl text-slate-300">{car.intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm text-slate-400">Estimated monthly cost</div>
            <div className="mt-2 text-3xl font-bold">{money(monthlyCost)}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm text-slate-400">Estimated annual cost</div>
            <div className="mt-2 text-3xl font-bold">{money(annualCost)}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm text-slate-400">3-year cost</div>
            <div className="mt-2 text-3xl font-bold">
              {money(totalThreeYearCost)}
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm text-slate-400">Typical MPG</div>
            <div className="mt-2 text-3xl font-bold">{car.mpg}</div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Estimated annual ownership cost
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
              <span>Repairs & wear</span>
              <strong>{money(car.repairs)}</strong>
            </div>

            <div className="flex justify-between">
              <span>Annual depreciation</span>
              <strong>{money(depreciation / ownershipYears)}</strong>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
              <span>Total annual ownership cost</span>
              <strong>{money(annualCost)}</strong>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <h3 className="font-semibold text-slate-950">Assumptions used</h3>
            <ul className="mt-3 space-y-1">
              <li>{annualMiles.toLocaleString()} miles per year</li>
              <li>{ownershipYears} years ownership</li>
              <li>Petrol at £1.50/litre</li>
              <li>Depreciation based on age, mileage, usage and car type</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Is the {car.name} expensive to run?
          </h2>

          <p className="mt-4 text-slate-600">
            A {car.name} is likely to cost around{" "}
            <strong>{money(monthlyCost)} per month</strong> over 3 years, based
            on {annualMiles.toLocaleString()} miles per year. The biggest costs
            are usually depreciation, insurance, fuel and maintenance.
          </p>

          <Link
            href="/v2"
            className="mt-6 block rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white"
          >
            Calculate your own {car.model} costs
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">
          {car.name} ownership cost breakdown
        </h2>

        <div className="mt-5 space-y-6 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-950">Fuel costs</h3>
            <p className="mt-2">{car.fuelText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-950">Insurance costs</h3>
            <p className="mt-2">{car.insuranceText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-950">Maintenance costs</h3>
            <p className="mt-2">{car.maintenanceText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-950">Depreciation</h3>
            <p className="mt-2">{car.depreciationText}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Is the {car.name} reliable?</h2>
        <p className="mt-4 whitespace-pre-line text-slate-600">
          {car.reliabilityText}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Real-world fuel economy</h2>
        <p className="mt-4 whitespace-pre-line text-slate-600">
          {car.fuelEconomyText}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Common ownership costs</h2>
        <p className="mt-4 whitespace-pre-line text-slate-600">
          {car.commonCostsText}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">
          Should you buy a {car.name}?
        </h2>

        <p className="mt-4 whitespace-pre-line text-slate-600">
          {car.buyingAdviceText}
        </p>

        <Link
          href="/v2"
          className="mt-6 block rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white"
        >
          Calculate your own {car.model} costs
        </Link>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">
          {car.name} running costs FAQs
        </h2>

        <div className="mt-5 space-y-5">
          {car.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-slate-950">{item.question}</h3>
              <p className="mt-2 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {relatedCars.length > 0 && (
        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Similar running cost guides
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedCars.slice(0, 6).map(([relatedSlug, relatedCar]) => (
              <Link
                key={relatedSlug}
                href={`/cost-to-own/${relatedSlug}`}
                className="rounded-2xl border border-slate-200 p-4 font-medium hover:bg-slate-50"
              >
                {relatedCar.name} running costs
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
    </main>
  </>
);
}
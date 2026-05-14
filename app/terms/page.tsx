export default function TermsPage() {
  return (
<main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-950">
  <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
      <h1 className="text-4xl font-bold">Terms of Use</h1>

      <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
        <p>
          Last updated: {new Date().getFullYear()}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Estimates only
          </h2>

          <p>
            CarCalc provides estimated vehicle ownership costs based on
            user inputs and internal assumptions. Calculations are for
            informational purposes only and may not reflect real-world
            costs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            No financial advice
          </h2>

          <p>
            CarCalc does not provide financial, legal or insurance advice.
            Users should independently verify any information before making
            financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Finance enquiries
          </h2>

          <p>
            Submitting a finance enquiry does not guarantee finance approval
            or finance offers. CarCalc is not currently acting as a licensed
            credit broker.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Limitation of liability
          </h2>

          <p>
            CarCalc and its operators are not liable for any losses,
            damages, or decisions made based on calculations or information
            provided by the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Availability
          </h2>

          <p>
            We may modify, suspend or remove parts of the service at any
            time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Contact
          </h2>

          <p>
            Questions about these terms can be sent to:
          </p>

          <p className="font-medium">
            admincarcalc@gmail.com
          </p>
        </section>
      </div>
  </div>
</main>
  );
}
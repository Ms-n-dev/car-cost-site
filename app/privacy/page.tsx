export default function PrivacyPage() {
  return (
<main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-950">
  <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>

      <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
        <p>
          Last updated: {new Date().getFullYear()}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Information we collect
          </h2>

          <p>
            CarCalc may collect information you voluntarily provide,
            including:
          </p>

          <ul className="list-disc pl-6">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Vehicle information</li>
            <li>Finance enquiry information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            How we use your information
          </h2>

          <p>
            We use submitted information to:
          </p>

          <ul className="list-disc pl-6">
            <li>Provide ownership cost calculations</li>
            <li>Email requested breakdowns</li>
            <li>Respond to finance quote enquiries</li>
            <li>Improve the website and user experience</li>
            <li>Monitor analytics and usage patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Analytics and cookies
          </h2>

          <p>
            CarCalc uses analytics tools including Google Analytics and
            Microsoft Clarity to understand how visitors use the site.
            These services may use cookies and collect anonymised usage
            data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Data sharing
          </h2>

          <p>
            We do not sell your personal information. Information may be
            shared with finance providers if you explicitly request finance
            quotes through the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Your rights
          </h2>

          <p>
            You may request access, correction or deletion of your personal
            information by contacting:
          </p>

          <p className="font-medium">
            admincarcalc@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Contact
          </h2>

          <p>
            For any privacy-related questions, contact:
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
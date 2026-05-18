import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function StepLayout({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="mx-auto w-full max-w-xl">
      <div className="mb-8 text-center sm:mb-12">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {eyebrow}
          </p>
        )}

        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500 sm:mt-5 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        )}
      </div>

      <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:p-7">
        {children}
      </div>
    </section>
  );
}
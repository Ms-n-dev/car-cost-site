type Props = {
  step: number;
};

const labels = ["Car", "Buying", "Costs", "Results"];

export default function ProgressBar({ step }: Props) {
  return (
    <div className="sticky top-4 z-30 mx-auto w-full max-w-xl rounded-full border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="mb-3 flex justify-between text-xs font-medium text-slate-500">
        {labels.map((label, index) => (
          <span
            key={label}
            className={index + 1 <= step ? "text-slate-950" : ""}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-950 transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}
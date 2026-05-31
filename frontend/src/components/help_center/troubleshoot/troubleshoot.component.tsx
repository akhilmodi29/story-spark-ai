import { FC } from "react";

interface TroubleshootItem {
  id?: string;
  title: string;
  symptoms: string;
  solution: string;
}

interface TroubleshootProps {
  items: TroubleshootItem[];
}

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  return (
    <section
      id="troubleshoot-section"
      className="scroll-mt-28 transition-colors duration-300"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-4">
          <i className="fa-solid fa-screwdriver-wrench"></i>
          <span className="text-sm font-semibold">TROUBLESHOOTING GUIDE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Fix Common Problems
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Diagnose and resolve common StorySparkAI issues quickly with guided
          troubleshooting steps and recommended fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <strong>Symptoms:</strong> {item.symptoms}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Solution:</strong> {item.solution}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Troubleshoot;
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    features: [
      "✓ 5 stories per month",
      "✓ Basic AI model access",
      "✓ Standard community support",
      "✓ Export to Plain Text",
    ],
    linkTo: "/signup",
    buttonLabel: "Get Started",
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    features: [
      "✓ Unlimited story generation",
      "✓ Advanced AI models (GPT-4 / Claude 3)",
      "✓ Priority email support",
      "✓ Advanced Markdown & PDF exports",
      "✓ Commercial usage rights",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: [
      "✓ Everything in Pro",
      "✓ Real-time team collaboration",
      "✓ Dedicated account manager",
      "✓ Full API access",
      "✓ Custom model fine-tuning",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
  },
];

const PricingComponent = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing-section" className="w-full box-border py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border relative z-10">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
            <i className="fa-solid fa-credit-card text-xs"></i>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Flexible Tiers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Choose the operational workspace tier tailored perfectly to match your creative pipeline volume requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-0 w-full box-border items-stretch">
  {plans.map((plan) => (
    <div
      key={plan.title}
      className="motion-card rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
        {plan.title}
      </h3>

      <div className="mb-4">
        <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">
          {plan.price}
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          {plan.duration}
        </span>
      </div>

      <ul className="mb-6 space-y-2 text-slate-700 dark:text-slate-400">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <button
        className="motion-cta mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
        onClick={() => navigate(plan.linkTo)}
      >
        {plan.buttonLabel}
      </button>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default PricingComponent;
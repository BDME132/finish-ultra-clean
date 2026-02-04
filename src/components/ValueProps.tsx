const values = [
  {
    title: "Curated by Runners",
    description:
      "Every item hand-picked by experienced ultra marathoners who know what works.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Race-Ready Packaging",
    description:
      "Organized and compact so you can focus on recovery, not rummaging through bags.",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    title: "Tested Nutrition",
    description:
      "Products that have fueled countless finish lines, selected for quality and effectiveness.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function ValueProps() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-light rounded-full mb-5">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={value.icon} />
                </svg>
              </div>
              <h3 className="font-headline text-xl font-semibold text-dark mb-3">
                {value.title}
              </h3>
              <p className="text-gray">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

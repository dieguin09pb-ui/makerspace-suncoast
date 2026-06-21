const ROLES = [
  {
    title: "President",
    singular: true,
    badge: "bg-indigo-100 text-indigo-800",
    border: "border-indigo-200",
    accent: "bg-indigo-600",
    summary:
      "Sets the club's long-term direction and holds final authority to resolve conflicts and prevent wasted effort. Operational decisions are delegated, but the President is the last escalation point.",
  },
  {
    title: "Vice President",
    singular: false,
    badge: "bg-violet-100 text-violet-800",
    border: "border-violet-200",
    accent: "bg-violet-600",
    summary:
      "Runs daily club operations — managing the Andon Board, agendas, and Pit Crew duty rotations. On the floor, they lead onboarding and stand-up schedules.",
  },
  {
    title: "Project Lead",
    singular: true,
    badge: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    summary:
      "Owns technical validation, 3D printing pipelines, and workshop safety. Has unilateral authority to restrict equipment access for safety violations.",
  },
  {
    title: "Competition Lead",
    singular: true,
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
    accent: "bg-amber-500",
    summary:
      "Manages the external competition calendar, documentation standards, and submission quality for organizations like NASA and Toshiba. Holds veto power over any submission that doesn't meet standards.",
  },
  {
    title: "PR & Ops Manager",
    singular: false,
    badge: "bg-purple-100 text-purple-800",
    border: "border-purple-200",
    accent: "bg-purple-600",
    summary:
      "Drives sponsorships, fundraising, and social media to grow the club's resources and reach. Also manages the Maker Marketplace and member recruitment.",
  },
  {
    title: "Pit Crew",
    singular: false,
    badge: "bg-slate-100 text-slate-700",
    border: "border-slate-200",
    accent: "bg-slate-500",
    summary:
      "Floating support desk on rotating shifts — guides members via the Andon Board help-ticket system without doing the work for them. Handles onboarding, lab patrols, and must log status before leaving.",
  },
];

const PREFACE = `This document outlines a clear and practical organizational structure for MakerSpace. It uses a lightweight matrix model to support agile, student-driven team formation, while maintaining shared validation across leadership and technical roles to prevent wasted time, money, or effort. Authority is determined by the type of decision being made, not by a rigid rank structure.`;

export function RolesSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="roles" className="bg-white py-10 px-4">
      <div className="mx-auto max-w-6xl">
        {!hideHeader && (
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">
              Organization
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">
              Club Structure &amp; Roles
            </h2>
            <blockquote className="mt-4 max-w-2xl text-sm text-gray-500 leading-relaxed border-l-2 border-indigo-200 pl-4 italic">
              {PREFACE}
            </blockquote>
          </div>
        )}
        {hideHeader && (
          <blockquote className="mb-8 max-w-2xl text-sm text-gray-500 leading-relaxed border-l-2 border-indigo-200 pl-4 italic">
            {PREFACE}
          </blockquote>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROLES.map((role) => (
            <div
              key={role.title}
              className={`rounded-2xl border ${role.border} bg-white shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {role.title}
                </h3>
                <span
                  className={`text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap flex-shrink-0 ${role.badge}`}
                >
                  {role.singular ? "Singular" : "Plural"}
                </span>
              </div>
              <div className={`h-0.5 w-8 rounded-full ${role.accent}`} />
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {role.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-indigo-50 border border-indigo-100 px-5 py-4">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
            Credits
          </p>
          <p className="text-sm text-gray-700">
            Organizational structure designed by{" "}
            <span className="font-semibold">Adib Karim</span> and{" "}
            <span className="font-semibold">Abhi</span>.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            &ldquo;Trust-by-system is the motto, accountability by the system is the goal.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

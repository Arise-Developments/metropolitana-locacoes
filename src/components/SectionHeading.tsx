export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "light",
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-sky-400" : "text-sky-600"}`}>
        <span className={`h-px w-8 ${dark ? "bg-sky-400" : "bg-sky-600"}`} />
        {eyebrow}
      </p>
      <h2 className={`font-display mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-navy-900"}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 leading-relaxed ${dark ? "text-white/65" : "text-slate-600"}`}>{text}</p>}
    </div>
  );
}

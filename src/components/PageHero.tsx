export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="bg-navy-900 py-14 lg:py-20">
      <div className="container-x">
        <p className="eyebrow flex items-center gap-3 text-sky-400">
          <span className="h-px w-10 bg-sky-400" /> {eyebrow}
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {text && <p className="mt-4 max-w-xl text-white/70">{text}</p>}
      </div>
    </section>
  );
}

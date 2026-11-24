import Link from "next/link";
import { CarFront } from "lucide-react";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "light" ? "text-white" : "text-navy-900";
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Metropolitana Locações — início">
      <span className="relative grid size-11 place-items-center border-2 border-sky-400">
        <CarFront className={`size-5 ${text}`} strokeWidth={1.8} />
        <span className="absolute -right-1 -bottom-1 size-2.5 bg-sky-400" />
      </span>
      <span className={`font-display text-[17px] leading-[1.05] font-extrabold tracking-tight uppercase ${text}`}>
        Metropolitana
        <br />
        Locações
      </span>
    </Link>
  );
}

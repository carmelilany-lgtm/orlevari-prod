import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("mb-12 max-w-2xl", className)}>
      <h2
        id={id}
        className="font-display text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.5rem]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-lg font-light leading-relaxed text-slate-400 sm:text-xl">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

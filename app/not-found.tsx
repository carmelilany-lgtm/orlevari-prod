import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070b14] px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(37,99,235,0.15),transparent_55%)]"
        aria-hidden
      />
      <p className="font-display text-8xl font-semibold tracking-tight text-blue-500/30 sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-slate-100 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-lg text-slate-400" dir="rtl" lang="he">
        הדף שחיפשתם לא נמצא
      </p>
      <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500">
        The link may be broken or the page may have been removed. Return to the
        homepage to explore Lev Ari Productions.
      </p>
      <div className="mt-10">
        <Button asChild href="/" variant="primary">
          Back to homepage
        </Button>
      </div>
      <p className="mt-4 text-xs text-slate-600">
        <Link
          href="/privacy-policy"
          className="underline-offset-2 hover:text-slate-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Privacy Policy
        </Link>
        {" · "}
        <Link
          href="/accessibility-statement"
          className="underline-offset-2 hover:text-slate-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Accessibility
        </Link>
      </p>
    </div>
  );
}

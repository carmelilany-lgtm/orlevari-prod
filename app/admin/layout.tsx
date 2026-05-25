import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ניהול",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-[#070b14]">
      {children}
    </div>
  );
}

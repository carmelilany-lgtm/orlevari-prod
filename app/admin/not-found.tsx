import Link from "next/link";
import { adminBtnPrimary } from "@/components/admin/admin-styles";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-semibold text-blue-500/40">404</p>
      <h1 className="mt-4 text-xl font-semibold text-white">הדף לא נמצא</h1>
      <p className="mt-2 text-sm text-slate-500">
        הקישור שגוי או שהדף הוסר ממערכת הניהול.
      </p>
      <Link href="/admin" className={`${adminBtnPrimary} mt-8`}>
        חזרה ללוח הבקרה
      </Link>
    </div>
  );
}

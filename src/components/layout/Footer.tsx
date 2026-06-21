import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/makerspaceLogo.png"
              alt="Makerspace logo"
              width={1610}
              height={741}
              className="h-12 w-auto object-contain"
            />
            <div>
              <p className="font-semibold text-indigo-600">Makerspace @ Suncoast</p>
              <p className="text-xs text-gray-500">A student-run makerspace focused on learning by building.</p>
            </div>
          </div>

          <p className="text-xs text-gray-500">Palm Beach County School District</p>

          <nav className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/calendar" className="hover:text-indigo-600 transition-colors">Calendar</Link>
            <Link href="/conflict" className="hover:text-indigo-600 transition-colors">Conflict</Link>
            <Link href="/org" className="hover:text-indigo-600 transition-colors">Org</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          2026-2027 School Year
        </div>
      </div>
    </footer>
  );
}

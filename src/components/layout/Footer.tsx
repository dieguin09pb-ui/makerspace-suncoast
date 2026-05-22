import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/Brain.png"
              alt="Makerspace logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <div>
              <p className="font-semibold text-[#5BA4CF]">Makerspace @ Suncoast</p>
              <p className="text-xs text-gray-500">STEM Club — Suncoast Community High School</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/images/RealLogoForSU.png"
              alt="Suncoast Community High School"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-xs text-gray-500">Palm Beach County School District</span>
          </div>

          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#5BA4CF] transition-colors">Home</Link>
            <Link href="/calendar" className="hover:text-[#5BA4CF] transition-colors">Calendar</Link>
            <Link href="/conflict" className="hover:text-[#5BA4CF] transition-colors">Report Conflict</Link>
            <Link href="/dashboard" className="hover:text-[#5BA4CF] transition-colors">Dashboard</Link>
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          2026-2027 School Year
        </div>
      </div>
    </footer>
  );
}

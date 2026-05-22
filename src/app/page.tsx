import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUARTERS, getMeetingDates } from "@/lib/calendar-data";

export default function HomePage() {
  const nextMeetings = QUARTERS.flatMap((q) => getMeetingDates(q))
    .filter((d) => d >= new Date())
    .slice(0, 3);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const clipartIcons = [
    { src: "/images/Gear#1.png", alt: "" },
    { src: "/images/Lightbulb.png", alt: "" },
    { src: "/images/Wrench#1.png", alt: "" },
    { src: "/images/Drill#2.png", alt: "" },
    { src: "/images/laptop.png", alt: "" },
    { src: "/images/Hammer#1.png", alt: "" },
    { src: "/images/Magnifying Glass Clipart.png", alt: "" },
    { src: "/images/Ruler.png", alt: "" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[#F0F7FF] py-16 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/images/Brain.png"
            alt="Makerspace brain logo"
            width={160}
            height={160}
            className="mx-auto mb-6 object-contain"
            priority
          />
          <h1 className="text-4xl font-bold text-[#5BA4CF] mb-3">
            Makerspace @ Suncoast
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            STEM Club — Suncoast Community High School
          </p>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Building the future one project at a time. We meet every Tuesday
            after school. Use this site to view our meeting calendar and
            report any scheduling conflicts so we can plan around your activities.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/calendar">
              <Button size="lg">View Meeting Calendar</Button>
            </Link>
            <Link href="/conflict">
              <Button size="lg" variant="outline">
                Report a Scheduling Conflict
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative clipart strip */}
      <div className="bg-white border-y border-gray-100 py-4 overflow-hidden">
        <div className="flex items-center justify-center gap-6 flex-wrap px-4">
          {clipartIcons.map((icon, i) => (
            <Image
              key={i}
              src={icon.src}
              alt={icon.alt}
              width={48}
              height={48}
              className="object-contain opacity-60"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* About + Quick Info */}
      <section className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#5BA4CF] mb-4">About Makerspace</h2>
          <p className="text-gray-600 mb-3 leading-relaxed">
            Makerspace is a student-run STEM club at Suncoast Community High
            School dedicated to hands-on learning. Members explore engineering,
            electronics, programming, robotics, and creative problem-solving
            through collaborative projects.
          </p>
          <p className="text-gray-600 mb-3 leading-relaxed">
            We recognize that athletes, musicians, and other activity
            participants have busy schedules. Use the conflict reporting form to
            let us know your recurring commitments so we can schedule meetings
            that work for the most members each quarter.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The dashboard lets leadership visualize scheduling data by day and
            quarter — making it easy to find the ideal meeting time no matter
            the season.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { src: "/images/Gear#1.png", label: "Engineering" },
            { src: "/images/laptop.png", label: "Programming" },
            { src: "/images/Drill#2.png", label: "Fabrication" },
            { src: "/images/Lightbulb.png", label: "Innovation" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2"
            >
              <Image
                src={item.src}
                alt=""
                width={64}
                height={64}
                className="object-contain"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="bg-white py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#5BA4CF] mb-6 text-center">
            Club Info
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Image
                  src="/images/Clipboard.png"
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-gray-800">Meeting Time</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Every Tuesday<br />After School (~3:30 PM)
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Image
                  src="/images/Brain.png"
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-gray-800">School</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Suncoast Community<br />High School
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Image
                  src="/images/Analytics.png"
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-gray-800">School Year</p>
                  <p className="text-sm text-gray-500 mt-1">
                    2026–2027<br />4 Quarters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Meetings */}
      {nextMeetings.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold text-[#5BA4CF] mb-6">
            Upcoming Meetings
          </h2>
          <div className="space-y-3">
            {nextMeetings.map((d) => (
              <div
                key={d.toISOString()}
                className="flex items-center gap-3 bg-white rounded-lg border border-gray-100 shadow-sm px-5 py-3"
              >
                <span className="w-2 h-2 rounded-full bg-[#5BA4CF] flex-shrink-0" />
                <span className="text-gray-700 font-medium">{fmtDate(d)}</span>
                <span className="ml-auto text-sm text-[#5BA4CF] bg-[#F0F7FF] rounded-full px-3 py-0.5">
                  After School
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/calendar">
              <Button variant="outline" size="sm">View Full Calendar</Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BA4CF] to-[#93C5FD] py-14 px-4 text-center text-white mt-4">
        <div className="mx-auto max-w-2xl">
          <Image
            src="/images/Clipboard.png"
            alt=""
            width={60}
            height={60}
            className="mx-auto mb-4 object-contain brightness-0 invert"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold mb-2">Have a Scheduling Conflict?</h2>
          <p className="mb-6 opacity-90">
            Sports practice, music rehearsal, or another commitment? Let us know so
            we can plan meetings that work for everyone.
          </p>
          <Link href="/conflict">
            <Button
              size="lg"
              className="bg-white text-[#5BA4CF] hover:bg-gray-50"
            >
              Report My Conflict
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

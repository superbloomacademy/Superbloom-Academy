import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">We could not find that page</h1>
      <p className="mt-4 max-w-xl text-lg text-slate">
        The link may be old or mistyped. Start from the courses or go back to the homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/streams" className="btn btn-bloom">
          See all courses
        </Link>
        <Link href="/" className="btn btn-line">
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}

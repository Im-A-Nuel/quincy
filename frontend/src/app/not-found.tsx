import Link from "next/link";
import { SearchArt } from "@/components/illustrations/spot";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="w-40">
        <SearchArt />
      </div>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/bounties" className="btn-ghost">
          Explore bounties
        </Link>
      </div>
    </div>
  );
}

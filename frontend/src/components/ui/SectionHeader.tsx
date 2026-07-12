import Link from "next/link";

/** Section title with an optional "see all" link on the right. */
export function SectionHeader({
  title,
  actionLabel,
  actionHref,
}: {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="text-sm font-semibold text-quincy-600 hover:text-quincy-700">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

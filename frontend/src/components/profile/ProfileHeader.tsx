import { Avatar } from "@/components/ui/Avatar";
import { shortAddress } from "@/lib/format";
import { addressUrl } from "@/lib/chains";

/** Gradient profile header card with avatar and wallet identity. */
export function ProfileHeader({
  address,
  completed,
}: {
  address: string;
  completed: number;
}) {
  return (
    <section className="overflow-hidden rounded-4xl bg-gradient-primary p-6 text-center text-white shadow-float">
      <div className="flex justify-center">
        <Avatar address={address} size="lg" />
      </div>
      <h1 className="mt-3 text-lg font-bold">{shortAddress(address)}</h1>
      <p className="text-sm text-white/70">
        {completed} bounties completed
      </p>
      <a
        href={addressUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"
      >
        View on explorer ↗
      </a>
    </section>
  );
}

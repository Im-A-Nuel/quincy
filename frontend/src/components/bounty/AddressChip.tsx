import Link from "next/link";
import { shortAddress } from "@/lib/format";

/** Small clickable wallet chip linking to the in-app profile page. */
export function AddressChip({
  address,
  label,
}: {
  address: `0x${string}` | null;
  label: string;
}) {
  if (!address) return null;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <Link href={`/profile/${address}`} className="font-medium text-quincy-700 hover:underline">
        {shortAddress(address)}
      </Link>
    </div>
  );
}

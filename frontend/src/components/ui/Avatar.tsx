/** Derive a stable soft gradient from a wallet address for avatar fallbacks. */
function gradientFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const h1 = hash % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 72%), hsl(${h2} 70% 60%))`;
}

const SIZE = { sm: "h-8 w-8", md: "h-11 w-11", lg: "h-16 w-16" };

/** Circular avatar with a colored ring; falls back to an address-seeded gradient. */
export function Avatar({
  address,
  size = "md",
  ring = true,
}: {
  address?: string | null;
  size?: keyof typeof SIZE;
  ring?: boolean;
}) {
  const initial = address ? address.slice(2, 3).toUpperCase() : "?";
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white transition-transform duration-200 ease-soft group-hover:scale-105 ${SIZE[size]} ${
        ring ? "ring-2 ring-white shadow-soft" : ""
      }`}
      style={{ background: address ? gradientFor(address) : "#c9d1cc" }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

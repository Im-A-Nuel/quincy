// Small flat spot illustrations for empty / state screens. Indigo palette,
// consistent 140x120 viewbox, soft rounded shapes.

type Props = { className?: string };

function Frame({ children, className = "" }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 140 120" fill="none" className={className} aria-hidden>
      <ellipse cx="70" cy="104" rx="46" ry="9" fill="#e0e7ff" />
      {children}
    </svg>
  );
}

/** Empty inbox / no bounties. */
export function EmptyBoxArt({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M40 54l30-14 30 14-30 14-30-14z" fill="#a5b4fc" />
      <path d="M40 54v28l30 14V68L40 54z" fill="#6366f1" />
      <path d="M100 54v28l-30 14V68l30-14z" fill="#818cf8" />
      <path d="M55 47l30 14" stroke="#eef2ff" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

/** Wallet not connected. */
export function WalletArt({ className }: Props) {
  return (
    <Frame className={className}>
      <rect x="38" y="46" width="64" height="44" rx="10" fill="#6366f1" />
      <rect x="38" y="58" width="64" height="6" fill="#4338ca" opacity="0.4" />
      <circle cx="90" cy="72" r="5" fill="#c7d2fe" />
      <rect x="46" y="36" width="44" height="16" rx="6" fill="#a5b4fc" />
    </Frame>
  );
}

/** No search results. */
export function SearchArt({ className }: Props) {
  return (
    <Frame className={className}>
      <circle cx="64" cy="56" r="22" fill="#eef2ff" stroke="#818cf8" strokeWidth="6" />
      <path d="M80 72l14 14" stroke="#6366f1" strokeWidth="7" strokeLinecap="round" />
      <path d="M56 56h16M64 48v16" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </Frame>
  );
}

/** Something went wrong. */
export function ErrorArt({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M70 34l34 58H36l34-58z" fill="#fee2e2" stroke="#ef4444" strokeWidth="5" strokeLinejoin="round" />
      <rect x="66" y="56" width="8" height="20" rx="4" fill="#ef4444" />
      <circle cx="70" cy="84" r="4.5" fill="#ef4444" />
    </Frame>
  );
}

/** Success / celebration. */
export function SuccessArt({ className }: Props) {
  return (
    <Frame className={className}>
      <circle cx="70" cy="60" r="30" fill="#dcfce7" />
      <path d="M56 60l10 10 18-20" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#a5b4fc" />
      <path d="M108 66l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="#c7d2fe" />
    </Frame>
  );
}

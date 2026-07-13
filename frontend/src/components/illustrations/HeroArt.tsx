/** Flat escrow illustration: a shield-locked vault with cUSD coins. */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="hero-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="hero-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* soft backdrop blobs */}
      <ellipse cx="160" cy="205" rx="120" ry="18" fill="#e0e7ff" />
      <circle cx="60" cy="60" r="30" fill="#eef2ff" />
      <circle cx="270" cy="70" r="20" fill="#eef2ff" />

      {/* shield / vault */}
      <path
        d="M160 40l70 24v46c0 44-30 74-70 88-40-14-70-44-70-88V64l70-24z"
        fill="url(#hero-g)"
      />
      <path
        d="M160 40l70 24v46c0 44-30 74-70 88V40z"
        fill="#4338ca"
        opacity="0.25"
      />

      {/* lock body */}
      <rect x="128" y="112" width="64" height="52" rx="14" fill="#fff" />
      <path
        d="M140 112v-10a20 20 0 0140 0v10"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="160" cy="134" r="8" fill="#4f46e5" />
      <rect x="156" y="138" width="8" height="14" rx="4" fill="#4f46e5" />

      {/* coins */}
      <g>
        <ellipse cx="66" cy="150" rx="26" ry="24" fill="url(#hero-coin)" />
        <ellipse cx="66" cy="144" rx="26" ry="24" fill="#c7d2fe" />
        <text x="66" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill="#4338ca">
          $
        </text>
      </g>
      <g>
        <ellipse cx="256" cy="160" rx="22" ry="20" fill="url(#hero-coin)" />
        <ellipse cx="256" cy="154" rx="22" ry="20" fill="#c7d2fe" />
        <text x="256" y="161" textAnchor="middle" fontSize="17" fontWeight="700" fill="#4338ca">
          $
        </text>
      </g>

      {/* sparkles */}
      <path d="M210 46l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10z" fill="#a5b4fc" />
      <path d="M96 96l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#c7d2fe" />
    </svg>
  );
}

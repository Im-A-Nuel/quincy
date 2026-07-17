# Design System

Quincy's visual language: soft, rounded, Apple-influenced — large radii, diffuse shadows, floating cards — with a thin "liquid glass" touch on fixed chrome (nav bars). All of it is plain Tailwind + hand-written CSS, no component library, no animation library.

## Brand

| Token | Value |
|---|---|
| Primary | `#4f46e5` (indigo-600) |
| Accent | `#6366f1` (indigo-500) |
| Canvas | `#FAFBFF` (light) / `#0b0e16` (dark) |
| Surface | `#FFFFFF` (light) / `#151a26` (dark) |

The full 50–900 indigo scale, soft category-tint accents, and semantic colors (success/warning/error/info) live in `frontend/tailwind.config.ts`.

`gradient-primary` — used by hero cards, buttons, the bottom-nav FAB, and the CTA — is a layered mesh gradient (two soft radial highlight blooms over a linear indigo base), not a flat two-stop fill.

## Dark mode

Class-based (`darkMode: "class"`), toggled by `ThemeToggle` and persisted to `localStorage`. `canvas`/`surface` are CSS variables that flip in one place; a small block in `globals.css` remaps the common `text-gray-*` / `bg-white` / `border-gray-*` utilities so most components adapt without per-component dark: variants. A no-flash init script in `layout.tsx` applies the class before first paint.

## Motion

Two custom easing curves beyond Tailwind's defaults:

* `ease-soft` — decelerate-only, for entrances and hovers
* `ease-spring` — slight overshoot, for taps and toggles
* `ease-snappy` — sharp-in/soft-out, for exits

Everything is CSS transitions/keyframes or vanilla Canvas (confetti) — no Framer Motion or similar, to keep the bundle light for low-end MiniPay devices. Notable pieces:

* `useCountUp` — animates numbers counting up (balances, stats)
* `useInView` + `Reveal` — scroll-triggered fade/slide, mirrors on scroll-back (elements re-hide leaving the viewport either direction)
* `useSlidingIndicator` — measures a chip's DOM position so a background pill can glide between tabs
* `fireConfetti` — a ~100-line dependency-free canvas burst for milestone moments (bounty approved, bounty posted)

All motion respects `prefers-reduced-motion` via one global override (`* { animation-duration: 0.01ms !important; ... }`) rather than per-component checks.

## Liquid glass

A `.glass` utility (backdrop blur + saturation boost + a hairline inner top highlight) is applied narrowly to fixed overlay chrome — the desktop top nav, mobile bottom nav, and the floating mobile theme toggle — not broadly to cards or toasts, where it would hurt legibility.

## Primitives

`components/ui/` — `Card` (with a `float` variant), `Button`, `TxButton` (crossfades between idle/pending content and swaps the browser tab title while pending), `Avatar` (address-seeded gradient fallback), `CopyButton`, `Reveal`, `TiltWrapper` (cursor-follow tilt, used once on the landing hero CTA), and the icon set in `icons.tsx` / `categoryIcons.tsx`.

import type { SVGProps } from "react";
import type { BountyCategory } from "@/lib/types";

// Outlined 24x24 line icons per bounty category (2px stroke, rounded).
type P = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {children}
    </svg>
  );
}

const Errand = (p: P) => (
  <Base {...p}>
    <circle cx="6" cy="17" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
    <path d="M8.5 17h6M14.5 17l-2-9H9M5 9h4l1.5 5" />
  </Base>
);
const Design = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="8.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
    <path d="M12 20.5c1.7 0 2-1.3 2-2.5s1-1.5 2-1.5" />
  </Base>
);
const Research = (p: P) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5M8 10.5h5M10.5 8v5" />
  </Base>
);
const Translation = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
  </Base>
);
const Development = (p: P) => (
  <Base {...p}>
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
  </Base>
);
const Writing = (p: P) => (
  <Base {...p}>
    <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
    <path d="M14 7l3 3" />
  </Base>
);
const Other = (p: P) => (
  <Base {...p}>
    <path d="M4 8l8-4 8 4-8 4-8-4z" />
    <path d="M4 8v8l8 4 8-4V8" />
  </Base>
);

export const CATEGORY_ICON: Record<BountyCategory, (p: P) => JSX.Element> = {
  errand: Errand,
  design: Design,
  research: Research,
  translation: Translation,
  development: Development,
  writing: Writing,
  other: Other,
};

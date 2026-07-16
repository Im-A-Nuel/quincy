// Minimal, dependency-free confetti burst. Keeps the bundle light (no
// canvas-confetti package) for a celebratory moment on the biggest milestones
// (bounty approved / posted). Skips entirely under prefers-reduced-motion.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
  life: number;
}

const COLORS = ["#4f46e5", "#6366f1", "#a5b4fc", "#facc15", "#ffffff"];

export function fireConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const count = 90;
  const originX = canvas.width / 2;
  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI - Math.PI * 1.5; // upward-ish spray
    const speed = 6 + Math.random() * 10;
    return {
      x: originX + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.35,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 20,
      size: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
    };
  });

  const gravity = 0.35;
  const start = performance.now();
  const durationMs = 1600;

  function frame(now: number) {
    if (!ctx) return;
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      p.life = Math.max(0, 1 - elapsed / durationMs);

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}

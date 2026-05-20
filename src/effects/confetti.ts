type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
  shape: "rect" | "circle";
};

export function fireConfetti(intensity = 1, originX?: number, originY?: number): void {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  document.body.append(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();

  const colors = ["#6366f1", "#818cf8", "#ec4899", "#f472b6", "#10b981", "#fbbf24", "#e7ebf5"];
  const startX = originX ?? window.innerWidth * 0.5;
  const startY = originY ?? window.innerHeight * 0.5;
  const count = Math.floor(55 * intensity);

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2;
    const speed = 4 + Math.random() * 9;
    return {
      x: startX + (Math.random() - 0.5) * 24,
      y: startY + (Math.random() - 0.5) * 12,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#6366f1",
      life: 0.85 + Math.random() * 0.15,
      shape: Math.random() > 0.45 ? "rect" : "circle",
    };
  });

  let frame = 0;
  const maxFrames = 100;

  const tick = () => {
    frame += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.22;
      particle.vx *= 0.992;
      particle.rotation += particle.spin;
      particle.life -= 0.011;

      ctx.save();
      ctx.globalAlpha = Math.max(particle.life, 0);
      ctx.fillStyle = particle.color;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      if (particle.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.w * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
      }

      ctx.restore();
    });

    if (frame < maxFrames) {
      window.requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };

  window.requestAnimationFrame(tick);
}

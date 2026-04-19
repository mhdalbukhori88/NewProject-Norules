"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  alpha: number;
};

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const seed = () => {
      particles.length = 0;
      for (let index = 0; index < 80; index += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.8,
          dy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.6 + 0.15
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x <= 0 || particle.x >= canvas.width) particle.dx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.dy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 184, 75, ${particle.alpha})`;
        ctx.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(201, 149, 42, ${0.3 - distance / 500})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-80" />;
}

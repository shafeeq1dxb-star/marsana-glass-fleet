import { useEffect, useRef } from "react";

export function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full bg-primary/20";
      
      const size = Math.random() * 4 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.opacity = `${0.3 + Math.random() * 0.4}`;
      
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const pathname = usePathname() ?? "";
  const portal = pathname.startsWith("/portal");
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce || portal) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // Se monta con el primer movimiento, no al correr el efecto.
      setReady(true);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, input, textarea, select, label, [role='button'], .carousel-item, .od-gm-btn"
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [portal, reduce, x, y]);

  if (!ready || portal) return null;

  return (
    <motion.div
      className={`od-cursor${hovering ? " is-hover" : ""}`}
      style={{
        x: sx,
        y: sy,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden
    >
      <span className="od-cursor-ring" />
      <span className="od-cursor-dot" />
    </motion.div>
  );
}

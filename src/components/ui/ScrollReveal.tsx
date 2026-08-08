"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "place";
}

export function ScrollReveal({ children, delay = 0, className = "", direction = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const translateMap = {
      up:    "translateY(40px)",
      left:  "translateX(-40px)",
      right: "translateX(40px)",
      place: "translateY(-14px) scale(0.97)",
    };
    const isPlace = direction === "place";
    const easing   = isPlace ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease";
    const duration = isPlace ? "0.5s" : "0.6s";

    el.style.opacity   = "0";
    el.style.transform = translateMap[direction];
    el.style.transition = `opacity ${duration} ${easing} ${delay}ms, transform ${duration} ${easing} ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = "1";
          el.style.transform = "none";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import Confetti from "react-confetti";

import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/use-window-size";

export function ConfettiTrigger() {
  const { width, height } = useWindowSize();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 10000); // dure 4s
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return <Confetti width={width} height={height} numberOfPieces={300} />;
}

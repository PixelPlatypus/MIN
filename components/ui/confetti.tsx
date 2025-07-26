"use client";

import React, { useEffect, useState } from 'react';
interface ConfettiProps {
  count?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ count = 50 }) => {
  const [confetti, setConfetti] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    const newConfetti: React.JSX.Element[] = [];
    for (let i = 0; i < count; i++) {
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`, // Random color
      };
      newConfetti.push(<div key={i} className="confetti" style={style} />);
    }
    setConfetti(newConfetti);
  }, [count]);

  return <>{confetti}</>;
};

export default Confetti;
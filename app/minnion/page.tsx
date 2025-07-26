"use client";

import { MinionImage } from '@/components/ui/minion-image.tsx';
import { Button } from '@/components/ui/button'; // Trigger recompile
import Link from 'next/link';
import Confetti from '@/components/ui/confetti';
import { useEffect, useState } from 'react';

export default function MinnionPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Confetti is always shown now, no need for localStorage check
    // setShowConfetti(true); // Already true by default
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-[#16556d] p-8 w-full overflow-hidden">
      {showConfetti && <Confetti count={100} />}
      <div className="relative z-10 p-8 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-white bg-opacity-20 border border-white border-opacity-30 max-w-3xl w-full flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-8 min-gradient-accent drop-shadow-md animate-pulse">
           Congratulations! 🎉
         </h1>
        
        <div className="max-w-md mb-8 rounded-lg overflow-hidden border border-white border-opacity-30 shadow-xl">
          <MinionImage className="w-full h-auto" />
        </div>
        
        <div className="max-w-2xl text-center mb-8 text-min-secondary">
           <p className="text-xl mb-4">
             You've discovered a hidden gem of the MIN website!
           </p>
          <p className="text-lg">
            We appreciate your curiosity and love for MIN. This special minion is
            our way of saying thank you for exploring our site!
          </p>
        </div>
      
      <Link href="/" passHref>
        <Button variant="outline" className="glass hover:glass-hover text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg">
            Back to Home
          </Button>
      </Link>
    </div>
    </div>
  );
}
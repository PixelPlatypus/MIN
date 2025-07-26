// components/ui/animated-glassmorphic-background.tsx
import React from 'react';

const AnimatedGlassmorphicBackground: React.FC = () => {
  return (
    <div className="animated-glassmorphic-background">
      {/* Grid structure */}
      <div className="grid-overlay"></div>

      {/* Moving symbols */}
      <div className="symbol symbol-1"></div>
      <div className="symbol symbol-2"></div>
      <div className="symbol symbol-3"></div>
      <div className="symbol symbol-4"></div>
      <div className="symbol symbol-5"></div>
    </div>
  );
};

export default AnimatedGlassmorphicBackground;
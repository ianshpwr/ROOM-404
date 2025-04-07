
import { useEffect, useState } from 'react';

interface IntroScreenProps {
  onIntroComplete: () => void;
}

const IntroScreen = ({ onIntroComplete }: IntroScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      // Wait for animation to complete before calling onIntroComplete
      const completeTimer = setTimeout(() => {
        onIntroComplete();
      }, 3000); // Match the fadeOut animation duration
      
      return () => clearTimeout(completeTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onIntroComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${fadeOut ? 'animate-fadeOut' : ''}`}>
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-widest text-white glitch-text">
          <span className="relative inline-block animate-glitch">ROOM-404</span>
        </h1>
        <p className="mt-4 text-gray-400 animate-pulse text-sm md:text-base">
          Entering secure communication channel...
        </p>
      </div>
    </div>
  );
};

export default IntroScreen;

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface StarProps {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

export default function CelestialBackground() {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--duration": star.duration,
            "--delay": star.delay,
          } as any}
        />
      ))}

      {/* Moving Planets */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="planet w-32 h-32 bg-gradient-to-br from-purple-600/20 to-blue-900/40 absolute top-1/4 left-1/4 rounded-full blur-xl"
      />

      <motion.div
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="planet w-48 h-48 bg-gradient-to-tr from-gold-500/10 to-orange-900/20 absolute bottom-1/4 right-1/4 rounded-full blur-2xl"
      />

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
      />
      
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full"
      />
    </div>
  );
}

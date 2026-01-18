import { motion } from "framer-motion";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function Mascot({ size = "md", animate = true }: MascotProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={animate ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Hero mascot - friendly robot/character */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <circle cx="50" cy="55" r="35" className="fill-primary" />
        
        {/* Face background */}
        <circle cx="50" cy="50" r="30" className="fill-card" />
        
        {/* Eyes */}
        <motion.g
          animate={animate ? { scaleY: [1, 0.1, 1] } : undefined}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        >
          <circle cx="38" cy="45" r="6" className="fill-foreground" />
          <circle cx="62" cy="45" r="6" className="fill-foreground" />
          <circle cx="40" cy="43" r="2" className="fill-card" />
          <circle cx="64" cy="43" r="2" className="fill-card" />
        </motion.g>
        
        {/* Smile */}
        <path
          d="M 35 55 Q 50 70 65 55"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-foreground"
        />
        
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="10" className="stroke-primary" strokeWidth="3" />
        <motion.circle
          cx="50"
          cy="8"
          r="4"
          className="fill-accent"
          animate={animate ? { scale: [1, 1.2, 1] } : undefined}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Cheeks */}
        <circle cx="28" cy="55" r="5" className="fill-accent/30" />
        <circle cx="72" cy="55" r="5" className="fill-accent/30" />
      </svg>
    </motion.div>
  );
}

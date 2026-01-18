import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isActive?: boolean;
  barCount?: number;
}

export function VoiceWaveform({ isActive = false, barCount = 20 }: VoiceWaveformProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full gradient-hero"
          animate={
            isActive
              ? {
                  height: [8, Math.random() * 48 + 16, 8],
                  opacity: [0.5, 1, 0.5],
                }
              : { height: 8, opacity: 0.3 }
          }
          transition={
            isActive
              ? {
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

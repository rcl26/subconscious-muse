interface AudioVisualizerProps {
  audioLevel: number;
  isRecording: boolean;
}

export const AudioVisualizer = ({ audioLevel, isRecording }: AudioVisualizerProps) => {
  // Generate bars with different heights based on audio level
  const generateBars = () => {
    const bars = [];
    const numBars = 12;
    
    for (let i = 0; i < numBars; i++) {
      // Create variation in bar heights based on audio level and position
      const variation = Math.sin((i / numBars) * Math.PI * 2) * 0.3 + 0.7;
      const height = isRecording 
        ? Math.max(0.1, (audioLevel * variation) + (Math.random() * 0.2))
        : 0.1;
      
      bars.push(
        <div
          key={i}
          className="bg-gradient-to-t from-primary/60 to-accent/80 rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${height * 100}%`,
            minHeight: '8px',
            width: '3px',
            animationDelay: `${i * 50}ms`,
          }}
        />
      );
    }
    
    return bars;
  };

  return (
    <div className="flex items-end justify-center space-x-1 h-16 w-32">
      {generateBars()}
    </div>
  );
};
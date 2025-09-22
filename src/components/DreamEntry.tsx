import { formatDistance } from "date-fns";
import { MessageCircle, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMobileDetection, triggerHapticFeedback } from "@/hooks/useMobileDetection";
import { Dream } from "@/hooks/useDreams";

const formatAbbreviatedTime = (date: Date) => {
  const distance = formatDistance(date, new Date());
  
  // Convert to abbreviated format
  if (distance.includes('less than a minute')) return '< 1m';
  if (distance.includes('minute')) {
    const minutes = distance.match(/\d+/)?.[0];
    return `${minutes}m`;
  }
  if (distance.includes('hour')) {
    const hours = distance.match(/\d+/)?.[0];
    return `${hours}h`;
  }
  if (distance.includes('day')) {
    const days = distance.match(/\d+/)?.[0];
    return `${days}d`;
  }
  if (distance.includes('week')) {
    const weeks = distance.match(/\d+/)?.[0];
    return `${weeks}w`;
  }
  if (distance.includes('month')) {
    const months = distance.match(/\d+/)?.[0];
    return `${months}mo`;
  }
  if (distance.includes('year')) {
    const years = distance.match(/\d+/)?.[0];
    return `${years}y`;
  }
  
  return distance;
};

interface DreamEntryProps {
  dream: Dream;
  onExplore: (dream: Dream) => void;
  onDelete: (dreamId: string) => void;
}

export const DreamEntry = ({ dream, onExplore, onDelete }: DreamEntryProps) => {
  const { isTouchDevice } = useMobileDetection();

  const handleExploreClick = () => {
    if (isTouchDevice) {
      triggerHapticFeedback('light');
    }
    onExplore(dream);
  };

  const handleDeleteClick = () => {
    if (isTouchDevice) {
      triggerHapticFeedback('medium');
    }
    onDelete(dream.id);
  };

  return (
    <Card className="relative p-6 bg-card shadow-float hover:shadow-dream transition-magical touch-manipulation group hover-scale">
      {/* Absolute positioned timestamp */}
      <span className="absolute top-4 right-6 text-xs text-muted-foreground">
        {formatAbbreviatedTime(new Date(dream.date))}
      </span>
      
      <div className="space-y-2">
        {dream.title && (
          <h3 className="text-base font-medium text-card-foreground mb-2 line-clamp-2 pr-12 break-words">
            {dream.title}
          </h3>
        )}
        
        <p className="text-sm leading-relaxed text-muted-foreground pr-12 break-words overflow-hidden">
          {dream.content}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-2">
            <Button
              onClick={handleExploreClick}
              size="sm"
              className={`border-0 min-h-[44px] px-4 ${
                dream.analysis || (dream.conversations && dream.conversations.length > 0)
                  ? "bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className={`hidden sm:inline ${
                !(dream.analysis || (dream.conversations && dream.conversations.length > 0))
                  ? "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer font-semibold"
                  : ""
              }`}>
                {dream.analysis || (dream.conversations && dream.conversations.length > 0) 
                  ? "View Analysis" 
                  : "Explore"
                }
              </span>
              <span className={`sm:hidden ${
                !(dream.analysis || (dream.conversations && dream.conversations.length > 0))
                  ? "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer font-semibold"
                  : ""
              }`}>
                {dream.analysis || (dream.conversations && dream.conversations.length > 0) 
                  ? "View" 
                  : "Explore"
                }
              </span>
            </Button>
          </div>
          
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-muted-foreground hover:bg-muted/10 min-h-[44px] min-w-[44px]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
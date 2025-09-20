import { formatDistance } from "date-fns";
import { Moon, MessageCircle, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMobileDetection, triggerHapticFeedback } from "@/hooks/useMobileDetection";
import { Dream } from "@/hooks/useDreams";

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
    <Card className="glass-card hover-lift touch-manipulation animate-slide-in-glass group">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground/80">
            <div className="flex items-center space-x-1">
              <span className="animate-twinkle">🌙</span>
              <span className="font-medium">{formatDistance(new Date(dream.date), new Date(), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {dream.title && (
            <h3 className="text-xl font-semibold text-card-foreground leading-tight tracking-tight group-hover:gradient-text transition-all duration-300">
              {dream.title}
            </h3>
          )}
          <p className="text-card-foreground/70 line-clamp-3 leading-relaxed text-[15px] font-medium">
            {dream.content}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3">
          <Button
            onClick={handleExploreClick}
            variant="outline"
            size="sm"
            className="glass-pill bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary hover:text-primary-foreground font-semibold px-4 relative overflow-hidden group/btn min-h-[44px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <MessageCircle className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10 hidden sm:inline">
              {dream.analysis || (dream.conversations && dream.conversations.length > 0) 
                ? "View Analysis" 
                : "Explore"
              }
            </span>
            <span className="relative z-10 sm:hidden">
              {dream.analysis || (dream.conversations && dream.conversations.length > 0) 
                ? "View" 
                : "Explore"
              }
            </span>
          </Button>
          
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="glass-pill text-muted-foreground/60 hover:text-destructive h-11 w-11 p-0 hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
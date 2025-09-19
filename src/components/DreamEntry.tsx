import { useState } from "react";
import { formatDistance } from "date-fns";
import { Moon, MessageCircle, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMobileDetection, triggerHapticFeedback } from "@/hooks/useMobileDetection";
import { useAuth } from "@/contexts/AuthContext";
import { PaywallModal } from "@/components/PaywallModal";
import { Dream } from "@/hooks/useDreams";

interface DreamEntryProps {
  dream: Dream;
  onExplore: (dream: Dream) => void;
  onDelete: (dreamId: string) => void;
  onSubscriptionClick: () => void;
}

export const DreamEntry = ({ dream, onExplore, onDelete, onSubscriptionClick }: DreamEntryProps) => {
  const { isTouchDevice } = useMobileDetection();
  const { hasActiveSubscription } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleExploreClick = () => {
    if (isTouchDevice) {
      triggerHapticFeedback('light');
    }
    
    // If there's already analysis/conversations, allow viewing regardless of subscription
    if (dream.analysis || (dream.conversations && dream.conversations.length > 0)) {
      onExplore(dream);
      return;
    }
    
    // For new analysis, check subscription
    if (!hasActiveSubscription) {
      setShowPaywall(true);
      return;
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
    <Card className="p-6 bg-card shadow-float border border-border/50 hover:shadow-dream transition-magical touch-manipulation">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {formatDistance(new Date(dream.date), new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed line-clamp-4">
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
              <span className="hidden sm:inline">
                {dream.analysis || (dream.conversations && dream.conversations.length > 0) 
                  ? "View Analysis" 
                  : "Explore"
                }
              </span>
              <span className="sm:hidden">
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
            className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onSubscribe={() => {
            setShowPaywall(false);
            onSubscriptionClick();
          }}
        />
      </div>
    </Card>
  );
};
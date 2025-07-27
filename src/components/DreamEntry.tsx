import { formatDistance } from "date-fns";
import { Moon, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Dream {
  id: string;
  text: string;
  date: Date;
  analysis?: string;
  emotions?: string[];
  themes?: string[];
}

interface DreamEntryProps {
  dream: Dream;
  onExplore: (dream: Dream) => void;
}

export const DreamEntry = ({ dream, onExplore }: DreamEntryProps) => {
  return (
    <Card className="p-6 bg-card shadow-float border border-border/50 hover:shadow-dream transition-magical">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {formatDistance(dream.date, new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-card-foreground leading-relaxed line-clamp-3">
            {dream.text}
          </p>

          {dream.emotions && dream.emotions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dream.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground"
                >
                  {emotion}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button
            onClick={() => onExplore(dream)}
            variant="outline"
            size="sm"
            className="bg-background/50 border-primary/20 hover:bg-primary/10 transition-magical"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Explore with GPT
          </Button>
        </div>
      </div>
    </Card>
  );
};
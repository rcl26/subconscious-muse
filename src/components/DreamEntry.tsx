import { formatDistance } from "date-fns";
import { Moon, MessageCircle, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Dream {
  id: string;
  content: string;
  date: string;
  analysis: string;
}

interface DreamEntryProps {
  dream: Dream;
  onExplore: (dream: Dream) => void;
  onDelete: (dreamId: string) => void;
}

export const DreamEntry = ({ dream, onExplore, onDelete }: DreamEntryProps) => {
  return (
    <Card className="p-6 bg-card shadow-float border border-border/50 hover:shadow-dream transition-magical">
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
              onClick={() => onExplore(dream)}
              size="sm"
              className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Explore (10 credits)
            </Button>
          </div>
          
          <Button
            onClick={() => onDelete(dream.id)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
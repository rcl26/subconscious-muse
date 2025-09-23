import { Button } from "@/components/ui/button";
import { Moon, Sparkles, Plus } from "lucide-react";

interface EmptyStateProps {
  type: 'no-dreams' | 'no-results';
  searchTerm?: string;
  onCreateDream?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState = ({ type, searchTerm, onCreateDream, onClearFilters }: EmptyStateProps) => {
  if (type === 'no-results') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="relative mb-6">
          <Moon className="h-16 w-16 text-primary-foreground/20 mx-auto" />
          <Sparkles className="h-6 w-6 text-primary-foreground/30 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="text-xl font-medium text-primary-foreground/80 mb-2">
          No Dreams Found
        </h3>
        <p className="text-primary-foreground/60 mb-6 max-w-md mx-auto">
          Your search for "{searchTerm}" didn't match any of your recorded dreams. 
          Try adjusting your search terms or explore different keywords.
        </p>
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="relative mb-8">
        <div className="relative">
          <Moon className="h-20 w-20 text-primary-foreground/20 mx-auto animate-float" />
          <Sparkles className="h-8 w-8 text-primary-foreground/30 absolute -top-2 -right-2 animate-pulse" />
          <Sparkles className="h-6 w-6 text-primary-foreground/20 absolute -bottom-1 -left-1 animate-pulse delay-500" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-primary-foreground/90 mb-8">
        Record Your First Dream
      </h3>
      
      <div className="space-y-4">
        <Button
          onClick={onCreateDream}
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 hover-scale"
        >
          <Plus className="h-5 w-5 mr-2" />
          Record Your First Dream
        </Button>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-primary-foreground/50">
          <div className="flex items-center space-x-1">
            <Moon className="h-3 w-3 text-primary-foreground/30" />
            <span>AI-powered analysis</span>
          </div>
          <div className="flex items-center space-x-1">
            <Moon className="h-3 w-3 text-primary-foreground/30" />
            <span>Private & secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Moon className="h-3 w-3 text-primary-foreground/30" />
            <span>Unlimited dreams</span>
          </div>
        </div>
      </div>
    </div>
  );
};
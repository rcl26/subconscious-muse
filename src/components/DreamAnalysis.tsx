import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, Loader2 } from "lucide-react";
import { Dream } from "@/components/DreamEntry";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

interface DreamAnalysisProps {
  dream: Dream;
  onBack: () => void;
}

export const DreamAnalysis = ({ dream, onBack }: DreamAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string | null>(dream.analysis || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzeDream } = useOpenAI();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeDream(dream.content);
      setAnalysis(result);
      
      // Update the dream object (in a real app, this would persist to a database)
      dream.analysis = result;
      
      toast({
        title: "Dream Analyzed",
        description: "Your dream has been analyzed by AI!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="hover:bg-background/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dream Analysis</h1>
          <p className="text-sm text-muted-foreground">
            {formatDistance(dream.date, new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Original Dream */}
      <Card className="p-6 bg-card shadow-float border border-border/50">
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Your Dream</h3>
          <p className="text-card-foreground leading-relaxed">
            {dream.content}
          </p>
        </div>
      </Card>

      {/* Analysis Section */}
      <Card className="p-6 bg-card shadow-float border border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">GPT Analysis</h3>
            </div>
            
            {!analysis && (
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Dream"
                )}
              </Button>
            )}
          </div>

          <Separator />

          {analysis ? (
            <div className="prose prose-sm max-w-none">
              <div className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
              
              {analysis && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button
                    onClick={handleAnalyze}
                    variant="outline"
                    size="sm"
                    disabled={isAnalyzing}
                    className="bg-background/50 border-primary/20 hover:bg-primary/10"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Re-analyzing...
                      </>
                    ) : (
                      "Re-analyze"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Click "Analyze Dream" to get AI insights about your dream</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
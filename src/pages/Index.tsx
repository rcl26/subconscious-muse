import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-night flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Magical header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Moon className="h-8 w-8 text-primary-foreground" />
            <Stars className="h-6 w-6 text-primary-foreground/70" />
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Dream Journal
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Unlock the wisdom of your subconscious. Record, explore, and understand your dreams with AI-powered insights.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3 text-primary-foreground/70">
            <div className="w-2 h-2 rounded-full bg-primary-foreground/50"></div>
            <span>Voice recording for fresh dream capture</span>
          </div>
          <div className="flex items-center space-x-3 text-primary-foreground/70">
            <div className="w-2 h-2 rounded-full bg-primary-foreground/50"></div>
            <span>AI-powered emotional analysis</span>
          </div>
          <div className="flex items-center space-x-3 text-primary-foreground/70">
            <div className="w-2 h-2 rounded-full bg-primary-foreground/50"></div>
            <span>Pattern recognition across dreams</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="w-full h-14 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-dream transition-magical text-lg"
        >
          <Link to="/journal">
            <Sparkles className="h-5 w-5 mr-2" />
            Begin Your Journey
          </Link>
        </Button>

        <p className="text-sm text-primary-foreground/60">
          Every dream holds a message. Start listening.
        </p>
      </div>
    </div>
  );
};

export default Index;

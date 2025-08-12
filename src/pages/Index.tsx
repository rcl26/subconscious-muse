import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/journal");
    }, 800);
  };

  // Add Enter key binding to activate the main CTA
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNavigation();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-night overflow-hidden relative">
      {/* Full-screen transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Primary magical wave sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/50 to-secondary/40 opacity-0 animate-[waveSwipeRight_800ms_ease-in-out_forwards]"></div>
          
          {/* Secondary wave from opposite direction */}
          <div className="absolute inset-0 bg-gradient-to-l from-secondary/30 via-primary/40 to-accent/30 opacity-0 animate-[waveSwipeLeft_800ms_ease-in-out_200ms_forwards]"></div>
          
          {/* Radial burst from center */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-accent/40 to-transparent opacity-0 animate-[radialBurst_600ms_ease-out_300ms_forwards]"></div>
          
          {/* Rotating magical circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-screen h-screen bg-gradient-conic from-primary/20 via-accent/30 to-secondary/20 opacity-0 animate-[fullScreenSpin_800ms_ease-in-out_100ms_forwards]"></div>
          </div>
          
          {/* Particle effects across screen */}
          <div className="absolute inset-0">
            {/* Top particles */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[particleStream_800ms_ease-out_forwards]"></div>
            <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-[particleStream_800ms_ease-out_100ms_forwards]"></div>
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-secondary/60 to-transparent animate-[particleStream_800ms_ease-out_200ms_forwards]"></div>
            <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[particleStream_800ms_ease-out_300ms_forwards]"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent/60 to-transparent animate-[particleStream_800ms_ease-out_400ms_forwards]"></div>
          </div>
          
          {/* Final screen fade */}
          <div className="absolute inset-0 bg-gradient-night opacity-0 animate-[screenTakeover_200ms_ease-in_600ms_forwards]"></div>
        </div>
      )}


      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Clean header */}
        <div className="text-center space-y-12 max-w-2xl mx-auto">
          <div className="relative">
            {/* Main title with gradient effect */}
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary-foreground via-primary-foreground/90 to-primary-foreground/70 mb-6 tracking-wider">
              Oneira
            </h1>
            
            {/* Mystical subtitle */}
            <div className="relative">
              <p className="text-2xl md:text-3xl text-primary-foreground/80 leading-relaxed font-light tracking-wide">
                Unlock the wisdom of your
              </p>
              <p className="text-2xl md:text-3xl text-primary-foreground leading-relaxed font-light tracking-wide mb-4">
                subconscious mind
              </p>
              
              {/* Subtle line decoration */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto mb-8"></div>
            </div>
          </div>

          {/* Immersive feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
            <div className="p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto">
                <Moon className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Capture</h3>
              <p className="text-sm text-primary-foreground/60">Voice recordings that preserve the essence of your dreams</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Analyze</h3>
              <p className="text-sm text-primary-foreground/60">AI-guided insights into emotions and hidden meanings</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-4 mx-auto">
                <Stars className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Discover</h3>
              <p className="text-sm text-primary-foreground/60">Patterns that reveal the deeper story of your psyche</p>
            </div>
          </div>

          {/* Ethereal CTA */}
          <div className="relative">
            <Button
              onClick={handleNavigation}
              size="lg"
              className="group h-16 px-12 bg-gradient-to-r from-primary-foreground/90 to-primary-foreground text-primary hover:from-primary-foreground hover:to-primary-foreground/95 shadow-dream hover:shadow-float transition-all duration-500 text-xl font-medium rounded-2xl hover:scale-105"
            >
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <div className="flex flex-col items-center">
                  <span>This way...</span>
                  <span className="text-xs opacity-60 font-light tracking-wide">(Enter)</span>
                </div>
                <div className="ml-3 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary animate-pulse"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;

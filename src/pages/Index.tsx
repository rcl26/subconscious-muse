import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { OptimizedBackground } from "@/components/OptimizedBackground";
import { FeedbackButton } from "@/components/FeedbackButton";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Only redirect on initial auth state change, not when navigating to home intentionally
  useEffect(() => {
    if (user && !window.location.pathname.includes('/')) {
      navigate("/journal");
    }
  }, [user, navigate]);

  const handleNavigation = () => {
    if (user) {
      navigate("/journal");
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/journal");
      }, 800);
    }
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
    <OptimizedBackground>
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


      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
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

          {/* Feature showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
            <div className="p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-4 mx-auto">
                <Moon className="h-6 w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Capture</h3>
              <p className="text-sm text-primary-foreground/50">Recordings that preserve the essence of your dreams</p>
            </div>
            
            <div className="p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/15 to-secondary/15 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Analyze</h3>
              <p className="text-sm text-primary-foreground/50">AI-guided insights into emotions and hidden meanings</p>
            </div>
            
            <div className="p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/15 to-primary/15 flex items-center justify-center mb-4 mx-auto">
                <Stars className="h-6 w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Discover</h3>
              <p className="text-sm text-primary-foreground/50">Patterns that reveal the deeper story of your psyche</p>
            </div>
          </div>

          {/* Cosmic Gateway CTA */}
          <div className="relative">
            {/* Cosmic glow effect behind button */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Button
              onClick={handleNavigation}
              size="lg"
              className="group relative h-16 px-12 bg-gradient-to-r from-slate-900/40 via-slate-800/50 to-slate-900/40 backdrop-blur-md text-primary-foreground border border-white/10 hover:border-white/20 shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] transition-all duration-500 text-xl font-medium rounded-2xl hover:scale-105 overflow-hidden"
            >
              {/* Mystical shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Cosmic particle effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                <div className="absolute bottom-3 left-8 w-0.5 h-0.5 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-violet-400 rounded-full animate-pulse delay-75"></div>
              </div>
              
              <div className="flex items-center relative z-10">
                <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300 text-purple-300" />
                <div className="flex flex-col items-center">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">Start Exploring</span>
                  <span className="text-xs opacity-60 font-light tracking-wide text-slate-300">(Enter)</span>
                </div>
                <div className="ml-3 w-2 h-2 rounded-full bg-purple-400/50 group-hover:bg-purple-400 animate-pulse group-hover:shadow-[0_0_10px_rgba(147,51,234,0.8)]"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <FeedbackButton />
    </OptimizedBackground>
  );
};

export default Index;

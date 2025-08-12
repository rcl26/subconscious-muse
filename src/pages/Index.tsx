import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Add Enter key binding to activate the main CTA
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        navigate("/journal");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-night overflow-hidden relative">
      {/* Floating mystical taglines and icons that move around screen */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Floating text phrases */}
        <p className="absolute text-primary-foreground/40 text-sm font-light tracking-wider animate-[float_20s_ease-in-out_infinite]">
          • every dream is a doorway •
        </p>
        <p className="absolute text-primary-foreground/30 text-xs font-light tracking-wider animate-[float2_25s_ease-in-out_infinite_2s]">
          dreams are the whispers of the soul
        </p>
        <p className="absolute text-primary-foreground/35 text-sm font-light tracking-wider animate-[float3_18s_ease-in-out_infinite_5s]">
          • in sleep, we remember who we are •
        </p>
        <p className="absolute text-primary-foreground/25 text-xs font-light tracking-wider animate-[float4_22s_ease-in-out_infinite_8s]">
          the unconscious speaks in symbols
        </p>
        <p className="absolute text-primary-foreground/40 text-sm font-light tracking-wider animate-[float5_28s_ease-in-out_infinite_12s]">
          • where thoughts become visions •
        </p>
        <p className="absolute text-primary-foreground/30 text-xs font-light tracking-wider animate-[float6_24s_ease-in-out_infinite_15s]">
          your mind's secret language
        </p>
        <p className="absolute text-primary-foreground/35 text-sm font-light tracking-wider animate-[float7_26s_ease-in-out_infinite_18s]">
          • wisdom lives in the shadows •
        </p>
        
        {/* Floating icons */}
        <Moon className="absolute h-8 w-8 text-primary-foreground/30 animate-[floatIcon1_30s_ease-in-out_infinite_3s]" />
        <Stars className="absolute h-6 w-6 text-primary-foreground/25 animate-[floatIcon2_35s_ease-in-out_infinite_10s]" />
        <Sparkles className="absolute h-7 w-7 text-primary-foreground/35 animate-[floatIcon3_32s_ease-in-out_infinite_16s]" />
        <Moon className="absolute h-5 w-5 text-primary-foreground/20 animate-[floatIcon4_28s_ease-in-out_infinite_22s]" />
        <Stars className="absolute h-4 w-4 text-primary-foreground/30 animate-[floatIcon5_33s_ease-in-out_infinite_7s]" />
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-accent/40 to-transparent blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Ethereal header with floating icons */}
        <div className="text-center space-y-12 max-w-2xl mx-auto animate-fade-in">
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
            <div className="group p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-float">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Moon className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Capture</h3>
              <p className="text-sm text-primary-foreground/60">Voice recordings that preserve the essence of your dreams</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-float delay-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Analyze</h3>
              <p className="text-sm text-primary-foreground/60">AI-guided insights into emotions and hidden meanings</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-float delay-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Stars className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">Discover</h3>
              <p className="text-sm text-primary-foreground/60">Patterns that reveal the deeper story of your psyche</p>
            </div>
          </div>

          {/* Ethereal CTA */}
          <div className="relative">
            <Button
              asChild
              size="lg"
              className="group h-16 px-12 bg-gradient-to-r from-primary-foreground/90 to-primary-foreground text-primary hover:from-primary-foreground hover:to-primary-foreground/95 shadow-dream hover:shadow-float transition-all duration-500 text-xl font-medium rounded-2xl hover:scale-105"
            >
              <Link to="/journal" className="flex items-center">
                <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Come this way
                <div className="ml-3 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary animate-pulse"></div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;

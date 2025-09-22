import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/components/GoogleIcon";
import { useToast } from "@/hooks/use-toast";



const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Only redirect on initial auth state change, not when navigating to home intentionally
  useEffect(() => {
    if (user && !window.location.pathname.includes('/')) {
      navigate("/journal");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen overflow-hidden relative" style={{
      backgroundImage: 'url(/cosmic-background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'hsl(var(--background))'
    }}>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30"></div>


      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
        {/* Clean header */}
        <div className="text-center space-y-6 md:space-y-12 max-w-2xl mx-auto">
          <div className="relative">
            {/* Main title with gradient effect */}
            <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary-foreground via-primary-foreground/90 to-primary-foreground/70 mb-3 md:mb-6 tracking-wider">
              Oneira
            </h1>
            
            {/* Mystical subtitle */}
            <div className="relative">
              <p className="text-lg md:text-3xl text-primary-foreground/80 leading-relaxed font-light tracking-wide">
                Unlock the wisdom of your
              </p>
              <p className="text-lg md:text-3xl text-primary-foreground leading-relaxed font-light tracking-wide mb-2 md:mb-4">
                subconscious mind
              </p>
              
              {/* Subtle line decoration */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto mb-4 md:mb-8"></div>
            </div>
          </div>

          {/* Mobile CTA - Show only on mobile, positioned early */}
          <div className="md:hidden">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              size="lg"
              className="group relative h-14 px-8 bg-gradient-to-r from-slate-900/40 via-slate-800/50 to-slate-900/40 backdrop-blur-md text-primary-foreground border border-white/10 hover:border-white/20 shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] transition-all duration-500 text-lg font-medium rounded-2xl hover:scale-105 overflow-hidden disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-center relative z-10">
                <GoogleIcon className="h-5 w-5 mr-3 text-white" />
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </div>
            </Button>
          </div>

          {/* Feature showcase - More compact on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-4 md:my-16">
            <div className="p-3 md:p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-2 md:mb-4 mx-auto">
                <Moon className="h-5 md:h-6 w-5 md:w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-primary-foreground mb-1 md:mb-2">Capture</h3>
              <p className="text-xs md:text-sm text-primary-foreground/50">Recordings that preserve the essence of your dreams</p>
            </div>
            
            <div className="p-3 md:p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-accent/15 to-secondary/15 flex items-center justify-center mb-2 md:mb-4 mx-auto">
                <Sparkles className="h-5 md:h-6 w-5 md:w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-primary-foreground mb-1 md:mb-2">Analyze</h3>
              <p className="text-xs md:text-sm text-primary-foreground/50">AI-guided insights into emotions and hidden meanings</p>
            </div>
            
            <div className="p-3 md:p-6 rounded-xl bg-primary-foreground/3 border border-primary-foreground/5">
              <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-secondary/15 to-primary/15 flex items-center justify-center mb-2 md:mb-4 mx-auto">
                <Stars className="h-5 md:h-6 w-5 md:w-6 text-primary-foreground/70" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-primary-foreground mb-1 md:mb-2">Discover</h3>
              <p className="text-xs md:text-sm text-primary-foreground/50">Patterns that reveal the deeper story of your psyche</p>
            </div>
          </div>

          {/* Desktop CTA - Hidden on mobile */}
          <div className="hidden md:block relative">
            {/* Cosmic glow effect behind button */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              size="lg"
              className="group relative h-16 px-12 bg-gradient-to-r from-slate-900/40 via-slate-800/50 to-slate-900/40 backdrop-blur-md text-primary-foreground border border-white/10 hover:border-white/20 shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] transition-all duration-500 text-xl font-medium rounded-2xl hover:scale-105 overflow-hidden disabled:opacity-50"
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
                <GoogleIcon className="h-6 w-6 mr-3 text-white" />
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
                <div className="ml-3 w-2 h-2 rounded-full bg-purple-400/50 group-hover:bg-purple-400 animate-pulse group-hover:shadow-[0_0_10px_rgba(147,51,234,0.8)]"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Index;

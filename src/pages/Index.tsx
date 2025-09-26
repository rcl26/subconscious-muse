import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Stars, Compass, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/components/GoogleIcon";
import { useToast } from "@/hooks/use-toast";
import { DreamWave } from "@/components/DreamWave";
import { GeometricBrackets } from "@/components/GeometricBrackets";
import { GeometricOverlay } from "@/components/GeometricOverlay";
import { FloatingShapes } from "@/components/FloatingShapes";



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
      
      {/* Geometric overlays */}
      <GeometricOverlay />
      <FloatingShapes />
      


      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10 font-helvetica">
        {/* Title Section with DreamWave */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="relative">
            {/* Main title with gradient effect and interactive hover states */}
            <div className="group relative cursor-default">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-br from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3 md:mb-6 transition-all duration-500 group-hover:scale-105 group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-indigo-300">
                Oneira
              </h1>
              {/* Floating orbs that respond to hover */}
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-purple-400/30 rounded-full blur-sm group-hover:bg-purple-300/50 transition-all duration-700 group-hover:animate-pulse"></div>
              <div className="absolute top-1/2 -right-6 w-2 h-2 bg-blue-400/40 rounded-full blur-sm group-hover:bg-blue-300/60 transition-all duration-500 group-hover:animate-bounce"></div>
              <div className="absolute -bottom-2 left-1/3 w-1.5 h-1.5 bg-indigo-400/35 rounded-full blur-sm group-hover:bg-indigo-300/55 transition-all duration-600"></div>
            </div>
            
            {/* Subtitle with elegant styling */}
            <div className="relative">
              <p className="text-lg md:text-xl text-primary-foreground/80 font-light tracking-wide leading-relaxed">
                Track your dreams, explore your subconscious
              </p>
              {/* Decorative underline */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto mb-4 md:mb-8"></div>
            </div>
          </div>
          
          {/* Dream wave positioned between subtitle and CTA */}
          <div className="my-12 md:my-16 relative">
            <DreamWave fullWidth={true} />
          </div>
        </div>

        {/* CTA Section - with generous top spacing */}
        <div className="text-center max-w-2xl mx-auto">
           {/* Mobile CTA */}
           <div className="md:hidden">
             <GeometricBrackets>
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
             </GeometricBrackets>
            </div>

           {/* Desktop CTA */}
          <div className="hidden md:block relative">
            <GeometricBrackets>
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
            </GeometricBrackets>
          </div>
        </div>
      </div>

      {/* Terms and Privacy at bottom */}
      <div className="absolute bottom-4 left-0 right-0 z-20">
        <p className="text-xs text-primary-foreground/30 md:text-primary-foreground/40 text-center">
          <Link to="/terms" className="text-primary-foreground/30 md:text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors underline decoration-primary-foreground/30 md:decoration-primary-foreground/40 hover:decoration-primary-foreground/60 underline-offset-2 relative z-20 cursor-pointer">
            Terms of Use
          </Link>
          {" | "}
          <Link to="/privacy" className="text-primary-foreground/30 md:text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors underline decoration-primary-foreground/30 md:decoration-primary-foreground/40 hover:decoration-primary-foreground/60 underline-offset-2 relative z-20 cursor-pointer">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Index;

import { useToast } from "@/hooks/use-toast";
import { useMobileDetection } from "@/hooks/useMobileDetection";

export const useShare = () => {
  const { toast } = useToast();
  const { isMobile } = useMobileDetection();

  const shareText = async (text: string, title: string = "My Dream") => {
    try {
      if (navigator.share && isMobile) {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to Clipboard",
          description: "Dream text has been copied to your clipboard",
        });
        return true;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share Failed",
        description: "Could not share the dream. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const canShare = () => {
    return navigator.share || navigator.clipboard;
  };

  return {
    shareText,
    canShare,
    hasNativeShare: !!(navigator.share && isMobile),
  };
};
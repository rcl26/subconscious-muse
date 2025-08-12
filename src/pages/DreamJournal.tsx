import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { CreditsPurchaseModal } from "@/components/CreditsPurchaseModal";
import { DreamRecorder } from "@/components/DreamRecorder";
import { DreamEntry, Dream } from "@/components/DreamEntry";
import { DreamConversationModal } from "@/components/DreamConversationModal";

export const DreamJournal = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleDreamRecorded = (dreamText: string) => {
    const newDream: Dream = {
      id: Date.now().toString(),
      content: dreamText,
      date: new Date().toISOString(),
      analysis: ""
    };
    
    setDreams([newDream, ...dreams]);
    setShowRecorder(false);
    
    toast({
      title: "Dream Recorded ✨",
      description: "Your dream has been captured and is ready for exploration.",
    });
  };

  const handleExploreDream = (dream: Dream) => {
    // First check if user is signed in
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Then check if they have enough credits
    if (!profile || profile.credits < 10) {
      setShowCreditsModal(true);
      return;
    }
    
    setSelectedDream(dream);
    setIsModalOpen(true);
  };

  const handleDeleteDream = (dreamId: string) => {
    const dreamToDelete = dreams.find(dream => dream.id === dreamId);
    if (!dreamToDelete) return;
    
    setDreams(dreams.filter(dream => dream.id !== dreamId));
    
    toast({
      title: "Dream Deleted",
      description: "The dream entry has been removed from your journal.",
      action: (
        <ToastAction 
          altText="Undo delete"
          onClick={() => {
            setDreams(prevDreams => [dreamToDelete, ...prevDreams.filter(d => d.id !== dreamId)]);
            toast({
              title: "Dream Restored",
              description: "Your dream entry has been restored.",
            });
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDream(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setDreams([]);
  };

  if (showRecorder) {
    return (
      <div className="min-h-screen bg-gradient-night p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowRecorder(false)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-primary-foreground">New Dream</h1>
              <p className="text-sm text-primary-foreground/60">Capture your subconscious</p>
            </div>
          </div>

          <DreamRecorder onDreamRecorded={handleDreamRecorded} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-night p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button 
                  onClick={() => setShowCreditsModal(true)}
                  className="flex items-center space-x-2 bg-primary-foreground/10 px-3 py-2 rounded-lg hover:bg-primary-foreground/20 transition-colors cursor-pointer"
                >
                  <Moon className="h-4 w-4 text-blue-300" />
                  <span className="text-primary-foreground font-medium">
                    {profile?.credits || 0} credits
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 justify-start"
              >
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
            <h1 className="text-2xl font-semibold text-primary-foreground">Oneira</h1>
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-primary-foreground/70">
            Capture and explore the wisdom of your dreams
          </p>
        </div>

        {/* Record new dream button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowRecorder(true)}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-14"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record New Dream
          </Button>
        </div>

        {/* Dreams list */}
        <div className="space-y-4">
          {dreams.length > 0 ? (
            dreams.map((dream) => (
              <DreamEntry 
                key={dream.id} 
                dream={dream} 
                onExplore={handleExploreDream}
                onDelete={handleDeleteDream}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <Moon className="h-16 w-16 text-primary-foreground/30 mx-auto mb-4" />
              <p className="text-primary-foreground/60 text-lg">
                No dreams recorded yet. Start your journey by recording your first dream.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <CreditsPurchaseModal open={showCreditsModal} onOpenChange={setShowCreditsModal} />
      
      {/* Dream Conversation Modal */}
      <DreamConversationModal
        dream={selectedDream}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { PasswordResetModal } from "@/components/PasswordResetModal";

import { DreamRecorder } from "@/components/DreamRecorder";
import { DreamEntry } from "@/components/DreamEntry";
import { DreamConversationModal } from "@/components/DreamConversationModal";
import { DreamSearchFilter } from "@/components/DreamSearchFilter";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useDreams, Dream } from "@/hooks/useDreams";
import { useDreamFilters } from "@/hooks/useDreamFilters";
import { useSubscriptionSuccess } from "@/hooks/useSubscriptionSuccess";

export const DreamJournal = () => {
  const { dreams, isLoading, saveDream, deleteDream, updateDreamConversation } = useDreams();
  const {
    searchTerm,
    setSearchTerm,
    filteredDreams,
    clearFilters,
    hasFilters
  } = useDreamFilters(dreams);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const { toast } = useToast();
  
  // Handle subscription success redirect
  useSubscriptionSuccess();


  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-night flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-primary-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  const handleDreamRecorded = (dreamText: string) => {
    console.log('📝 DreamJournal: handleDreamRecorded called with:', dreamText);
    
    // Save dream with optimistic update (happens instantly)
    saveDream(dreamText);
    
    // Close recorder immediately
    setShowRecorder(false);
    console.log('🔙 DreamJournal: Recorder closed, dream added to journal');
  };

  const handleExploreDream = (dream: Dream) => {
    // Allow analysis without authentication or credit requirements
    setSelectedDream(dream);
    setIsModalOpen(true);
  };

  const handleDeleteDream = async (dreamId: string) => {
    const dreamToDelete = dreams.find(dream => dream.id === dreamId);
    if (!dreamToDelete) return;
    
    const success = await deleteDream(dreamId);
    
    if (success) {
      toast({
        title: "Dream Deleted",
        description: "The dream entry has been removed from your journal.",
        action: (
          <ToastAction 
            altText="Undo delete"
            onClick={async () => {
              try {
                await saveDream(dreamToDelete.content);
                toast({
                  title: "Dream Restored",
                  description: "Your dream entry has been restored.",
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Unable to restore dream. Please try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            Undo
          </ToastAction>
        ),
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDream(null);
  };

  const handleSignOut = async () => {
    await signOut();
    // Dreams will be cleared automatically by useDreams hook when user becomes null
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
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
              <ProfileDropdown 
                onSignOut={handleSignOut}
              />
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
            onClick={() => {
              if (!user) {
                setShowAuthModal(true);
              } else {
                setShowRecorder(true);
              }
            }}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-14"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record New Dream
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4">
          {dreams.length > 0 && (
            <DreamSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={clearFilters}
              resultsCount={filteredDreams.length}
              totalCount={dreams.length}
            />
          )}
        </div>

        {/* Dreams list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-primary-foreground/60">Loading your dreams...</p>
            </div>
          ) : dreams.length > 0 ? (
            filteredDreams.length > 0 ? (
              filteredDreams.map((dream) => (
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
                  {hasFilters 
                    ? "No dreams match your search criteria." 
                    : "No dreams recorded yet. Start your journey by recording your first dream."
                  }
                </p>
                {hasFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="mt-4 text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )
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
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onAuthSuccess={handleAuthSuccess} />
      
      <PasswordResetModal 
        open={showPasswordReset} 
        onOpenChange={setShowPasswordReset}
        onSuccess={() => {
          toast({
            title: "Password Updated!",
            description: "You can now use your new password to sign in.",
          });
        }}
      />
      
      {/* Dream Conversation Modal */}
      <DreamConversationModal
        dream={selectedDream}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateConversation={updateDreamConversation}
      />
    </div>
  );
};
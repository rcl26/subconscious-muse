import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { PasswordResetForm } from "@/components/PasswordResetForm";


import { DreamRecorder } from "@/components/DreamRecorder";
import { DreamEntry } from "@/components/DreamEntry";
import { DreamConversationModal } from "@/components/DreamConversationModal";
import { DreamSearchFilter } from "@/components/DreamSearchFilter";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { DreamEntrySkeleton } from "@/components/DreamEntrySkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useDreams, Dream } from "@/hooks/useDreams";
import { useDreamFilters } from "@/hooks/useDreamFilters";
import { useSubscriptionSuccess } from "@/hooks/useSubscriptionSuccess";
import { FeedbackButton } from "@/components/FeedbackButton";

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
  
  const { user, profile, signOut, loading, isPasswordReset } = useAuth();
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

  const handleDreamRecorded = (dreamText: string, title?: string) => {
    console.log('📝 DreamJournal: handleDreamRecorded called with:', dreamText, title);
    
    // Save dream with optimistic update (happens instantly)
    saveDream(dreamText, title);
    
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
                await saveDream(dreamToDelete.content, dreamToDelete.title, false);
                toast({
                  title: "Dream Restored",
                  description: "Your dream entry has been restored.",
                  duration: 1500,
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

  // Show password reset form if we're in password reset mode
  if (isPasswordReset) {
    return <PasswordResetForm onSuccess={() => window.location.reload()} />;
  }

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
            </div>
          </div>

          <DreamRecorder onDreamRecorded={handleDreamRecorded} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-background relative overflow-hidden">
      {/* Constellation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white/60 rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-0.5 h-0.5 bg-white/40 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/45 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/35 rounded-full animate-twinkle" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-0.5 h-0.5 bg-white/55 rounded-full animate-twinkle" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-twinkle" style={{ animationDelay: '1.8s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-8 flex items-center justify-between relative z-10">
          <h1 className="text-3xl font-bold gradient-text tracking-tight">
            ✨ Oneira
          </h1>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <ProfileDropdown 
                onSignOut={handleSignOut}
              />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="glass-pill bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
            <FeedbackButton />
          </div>
        </header>

        {dreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold gradient-text">Welcome to Your Dream Journal</h2>
              <p className="text-white/70 text-lg max-w-md">
                Start capturing and exploring the hidden meanings in your dreams
              </p>
            </div>
            
            <Button
              onClick={() => {
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowRecorder(true);
                }
              }}
              size="lg"
              className="glass-pill bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white font-bold px-12 py-6 shadow-premium transition-all duration-300 relative overflow-hidden group text-lg"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ripple"></div>
              <Plus className="w-6 h-6 mr-3 relative z-10" />
              <span className="relative z-10">Record Your First Dream</span>
            </Button>
          </div>
        ) : (
          <>
            {!showRecorder && (
              <div className="text-center mb-12">
                <Button
                  onClick={() => setShowRecorder(true)}
                  size="lg"
                  className="glass-pill bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white font-bold px-12 py-6 shadow-premium transition-all duration-300 relative overflow-hidden group text-lg"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ripple"></div>
                  <Plus className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Record New Dream</span>
                </Button>
              </div>
            )}
          </>
        )}

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
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <DreamEntrySkeleton key={index} />
              ))}
            </div>
          ) : dreams.length > 0 ? (
            filteredDreams.length > 0 ? (
              <div className="space-y-4">
                {filteredDreams.map((dream, index) => (
                  <div 
                    key={dream.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <DreamEntry 
                      dream={dream} 
                      onExplore={handleExploreDream}
                      onDelete={handleDeleteDream}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                type="no-results" 
                searchTerm={searchTerm}
                onClearFilters={clearFilters}
              />
            )
          ) : (
            <EmptyState 
              type="no-dreams"
              onCreateDream={() => {
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowRecorder(true);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onAuthSuccess={handleAuthSuccess} />
      
      {/* Dream Conversation Modal */}
      <DreamConversationModal
        dream={selectedDream}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateConversation={updateDreamConversation}
      />
      
      <FeedbackButton />
    </div>
  );
};
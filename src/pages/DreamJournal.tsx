import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles, MessageSquare, Heart, Mic, Edit3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";



import { DreamRecorder } from "@/components/DreamRecorder";
import { InlineVoiceRecorder } from "@/components/InlineVoiceRecorder";
import { DreamEntry } from "@/components/DreamEntry";
import { DreamConversationModal } from "@/components/DreamConversationModal";
import { DreamSearchFilter } from "@/components/DreamSearchFilter";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { DreamEntrySkeleton } from "@/components/DreamEntrySkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useDreams, Dream } from "@/hooks/useDreams";
import { useDreamFilters } from "@/hooks/useDreamFilters";
import { useSubscriptionSuccess } from "@/hooks/useSubscriptionSuccess";
import { useAnalytics } from "@/hooks/useAnalytics";

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
  const [showInlineVoiceRecorder, setShowInlineVoiceRecorder] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user, profile, signOut, loading, profileLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  
  // Handle subscription success redirect
  useSubscriptionSuccess();

  // Track journal page view and sign in
  useEffect(() => {
    if (!loading && user) {
      trackEvent('journal_page_viewed');
      // Track sign in on first load (if user just signed in)
      const hasTrackedSignIn = sessionStorage.getItem('has_tracked_signin');
      if (!hasTrackedSignIn) {
        trackEvent('user_signed_in');
        sessionStorage.setItem('has_tracked_signin', 'true');
      }
    }
  }, [loading, user]);

  // Check onboarding status
  useEffect(() => {
    if (!loading && !profileLoading && user && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [user, profile, loading, profileLoading, navigate]);

  // Show loading screen while auth is initializing
  if (loading || profileLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          background: `linear-gradient(rgba(55, 35, 85, 0.8), rgba(70, 45, 100, 0.85)), url('/cosmic-background-low.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-pulse" />
          <p className="text-primary-foreground/60 animate-pulse">Connecting to your dream journal...</p>
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


  if (showRecorder) {
    return (
      <div 
        className="min-h-screen p-4 relative"
        style={{
          background: `linear-gradient(rgba(55, 35, 85, 0.8), rgba(70, 45, 100, 0.85)), url('/cosmic-background-low.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-start">
            <Button
              onClick={() => setShowRecorder(false)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>

          <DreamRecorder onDreamRecorded={handleDreamRecorded} />
        </div>
      </div>
    );
  }


  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        background: `linear-gradient(rgba(55, 35, 85, 0.8), rgba(70, 45, 100, 0.85)), url('/cosmic-background-low.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto font-helvetica">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {user && (
            <h1 className="text-lg font-cormorant font-semibold text-primary-foreground">
              {profile?.preferred_name ? `${profile.preferred_name}'s Journal` : 'Your Journal'}
            </h1>
          )}
          
          <div className="flex items-center space-x-4">
            {user && (
              <ProfileDropdown 
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </div>

        {/* Recording Interface */}
        <div className="text-center mb-8 space-y-4">
          {/* Primary Voice Recording Option */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => {
                trackEvent('record_dream_clicked');
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowInlineVoiceRecorder(true);
                }
              }}
              className="relative group w-20 h-20 rounded-full bg-white/10 border-2 border-white/60 flex items-center justify-center hover:bg-white/20 hover:border-white/70 transition-all duration-300 hover:scale-105"
            >
              <Mic className="h-7 w-7 text-primary" />
            </button>
            <p className="text-white/90 text-base font-light tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Record new dream
            </p>
          </div>
          
          {/* "or" separator text */}
          <p className="text-white/60 text-sm tracking-wide -my-1">or</p>
          
          {/* Secondary Manual Entry Option */}
          <div>
            <Button
              onClick={() => {
                trackEvent('record_dream_clicked');
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowRecorder(true);
                }
              }}
              variant="outline"
              size="default"
              className="bg-transparent text-white/80 border-primary-foreground/30 hover:bg-primary-foreground/5 hover:text-white/80"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Type manually
            </Button>
          </div>
        </div>

        {/* Inline Voice Recorder */}
        {showInlineVoiceRecorder && (
          <InlineVoiceRecorder
            onDreamRecorded={(dreamText, title) => {
              handleDreamRecorded(dreamText, title);
              setShowInlineVoiceRecorder(false);
            }}
            onCancel={() => setShowInlineVoiceRecorder(false)}
          />
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
              isSignedIn={!!user}
              onCreateDream={() => {
                trackEvent('record_dream_clicked');
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
    </div>
  );
};
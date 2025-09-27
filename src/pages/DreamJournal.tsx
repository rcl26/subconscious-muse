import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles, MessageSquare, Heart, Mic, Edit3, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";



import { ModernDreamRecorder } from "@/components/ModernDreamRecorder";
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
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
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

  const handleDreamRecorded = (dreamText: string, title?: string, showToast: boolean = true) => {
    console.log('📝 DreamJournal: handleDreamRecorded called with:', dreamText, title);
    
    // Save dream with optimistic update (happens instantly)
    saveDream(dreamText, title, showToast);
    
    console.log('🔙 DreamJournal: Dream added to journal');
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
        {user ? (
          <div className="flex items-center justify-between mb-8">
            <ProfileDropdown onSignOut={handleSignOut} />
            <div className="flex items-center space-x-2 text-primary-foreground/80">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">100</span>
            </div>
          </div>
        ) : (
          <div className="mb-8" />
        )}

        {/* Modern Dream Recorder */}
        {user && (
          <div className="max-w-md mx-auto mb-8">
            <ModernDreamRecorder 
              onDreamRecorded={handleDreamRecorded}
            />
          </div>
        )}

        {/* Search and Filter - Only show when activated */}
        {showSearch && dreams.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <DreamSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={clearFilters}
              onCloseSearch={() => setShowSearch(false)}
              resultsCount={filteredDreams.length}
              totalCount={dreams.length}
            />
          </div>
        )}

        {/* Dreams Section Header */}
        {user && dreams.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-cormorant font-semibold text-primary-foreground">
              {profile?.preferred_name ? `${profile.preferred_name}'s Journal` : 'Your Journal'}
            </h2>
            
            {!showSearch && (
              <Button
                onClick={() => setShowSearch(true)}
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground p-2 rounded-lg"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

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
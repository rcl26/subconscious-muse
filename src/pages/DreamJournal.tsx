import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Plus, User, LogOut, Zap, CreditCard, Sparkles, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";



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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const { user, profile, signOut, loading } = useAuth();
  const { toast } = useToast();
  
  // Handle subscription success redirect
  useSubscriptionSuccess();


  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          background: `linear-gradient(rgba(37, 20, 61, 0.85), rgba(48, 25, 78, 0.9)), url('/cosmic-background-low.png')`,
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
          background: `linear-gradient(rgba(37, 20, 61, 0.85), rgba(48, 25, 78, 0.9)), url('/cosmic-background-low.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
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
    <div 
      className="min-h-screen p-4 relative"
      style={{
        background: `linear-gradient(rgba(37, 20, 61, 0.85), rgba(48, 25, 78, 0.9)), url('/cosmic-background-low.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Popover open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-primary-foreground/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                Feedback
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom" 
              align="start" 
              className="w-80 p-6"
              sideOffset={8}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">We'd Love to Hear From You!</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Feedback is always more than welcome. You can contact us at{' '}
                  <span className="font-medium text-foreground">oneiradreamteam@gmail.com</span>
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
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
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0 justify-start"
              >
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Title and Record Button - Only show when user has dreams */}
        {dreams.length > 0 && (
          <>
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl font-semibold text-primary-foreground">Your Journal</h1>
            </div>

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
    </div>
  );
};
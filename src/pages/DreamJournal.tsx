import { useState } from "react";
import { DreamRecorder } from "@/components/DreamRecorder";
import { DreamEntry, Dream } from "@/components/DreamEntry";
import { DreamConversationModal } from "@/components/DreamConversationModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const DreamJournal = () => {
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: "1",
      text: "I found myself in a vast library with books that glowed softly in the darkness. Each book I touched revealed memories I had forgotten, and I felt a deep sense of connection to my past self.",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      emotions: ["nostalgic", "peaceful", "curious"],
      themes: ["memory", "knowledge", "self-discovery"]
    },
    {
      id: "2", 
      text: "Flying through clouds that felt like cotton candy, I could taste the sweetness in the air. Below me was my childhood home, but it was surrounded by a garden that never existed in real life.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      emotions: ["joyful", "free", "homesick"],
      themes: ["childhood", "freedom", "home"]
    }
  ]);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDreamRecorded = (dreamText: string) => {
    const newDream: Dream = {
      id: Date.now().toString(),
      text: dreamText,
      date: new Date(),
      emotions: ["peaceful", "curious"], // Placeholder
    };
    
    setDreams([newDream, ...dreams]);
    setShowRecorder(false);
    
    toast({
      title: "Dream Recorded ✨",
      description: "Your dream has been captured and is ready for exploration.",
    });
  };

  const handleExploreDream = (dream: Dream) => {
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

  if (showRecorder) {
    return (
      <div className="min-h-screen bg-gradient-morning p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowRecorder(false)}
              variant="ghost"
              size="sm"
              className="hover:bg-background/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">New Dream</h1>
              <p className="text-sm text-muted-foreground">Capture your subconscious</p>
            </div>
          </div>

          <DreamRecorder onDreamRecorded={handleDreamRecorded} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-morning">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Dream Journal</h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Capture and explore the wisdom of your dreams
          </p>
        </div>

        {/* Record New Dream Button */}
        <Button
          onClick={() => setShowRecorder(true)}
          className="w-full h-14 bg-primary hover:bg-primary/90 shadow-dream transition-magical"
          size="lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Record New Dream
        </Button>

        {/* Dreams List */}
        <div className="space-y-4">
          {dreams.length > 0 ? (
            <>
              <h2 className="text-lg font-medium text-foreground px-2">Your Dreams</h2>
              {dreams.map((dream) => (
                <DreamEntry
                  key={dream.id}
                  dream={dream}
                  onExplore={handleExploreDream}
                  onDelete={handleDeleteDream}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Moon className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-muted-foreground">No dreams recorded yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Start capturing your subconscious insights
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dream Conversation Modal */}
        <DreamConversationModal
          dream={selectedDream}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};
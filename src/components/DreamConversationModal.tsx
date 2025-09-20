import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Moon, Bot, User, Zap, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dream, Message } from "@/hooks/useDreams";

interface DreamConversationModalProps {
  dream: Dream | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConversation: (dreamId: string, conversations: Message[]) => void;
}

export const DreamConversationModal = ({ dream, isOpen, onClose, onUpdateConversation }: DreamConversationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile, refreshProfile } = useAuth();
  const { analyzeDream } = useOpenAI();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Only auto-scroll when user sends a message, not when AI responds
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages]);

  // Load existing conversation or start analysis when modal opens
  useEffect(() => {
    if (dream && isOpen && !hasStartedAnalysis) {
      console.log('🎯 useEffect triggered - checking for existing conversation');
      
      // Check if dream has existing conversations
      if (dream.conversations && dream.conversations.length > 0) {
        console.log('📜 Loading existing conversation');
        setMessages(dream.conversations);
        setHasStartedAnalysis(true);
      } else {
        console.log('🎯 Starting new analysis');
        startInitialAnalysis();
        setHasStartedAnalysis(true);
      }
    }
  }, [dream, isOpen, hasStartedAnalysis]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setHasStartedAnalysis(false);
      setInputValue("");
    }
  }, [isOpen]);

  const startInitialAnalysis = async () => {
    console.log('🎯 startInitialAnalysis called');
    if (!dream) {
      console.log('❌ No dream object found');
      return;
    }

    
    console.log('🌙 Starting initial dream analysis for:', dream.content.substring(0, 50) + '...');
    console.log('🔧 analyzeDream function:', typeof analyzeDream);
    setIsLoading(true);
    try {
      console.log('📞 About to call analyzeDream...');
      const analysis = await analyzeDream(dream.content);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: analysis,
        timestamp: new Date()
      };
      
      setMessages([assistantMessage]);
      console.log('✨ Initial analysis complete');
      
      // Save conversation to database
      if (dream?.id) {
        onUpdateConversation(dream.id, [assistantMessage]);
      }
    } catch (error) {
      console.error('❌ Error in initial analysis:', error);
      toast({
          title: "Analysis Error",
          description: error.message.includes('timeout') 
            ? "The analysis is taking too long. Please try again with a shorter dream description."
            : `Unable to analyze your dream: ${error.message || 'Please try again.'}`,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    shouldScrollRef.current = true; // Mark that we should scroll after this update

    try {
      const conversationContext = hasStartedAnalysis 
        ? `Previous conversation:
${messages.map(m => `${m.role === 'user' ? 'Dreamer' : 'Dream Guide'}: ${m.content}`).join('\n\n')}

Dreamer: ${userMessage.content}

Please continue the conversation as their dream guide.`
        : `Dream Description: ${dream?.content}

${userMessage.content}

Please provide a thoughtful analysis of this dream.`;

      const analysis = await analyzeDream(conversationContext);
      
      if (analysis) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: analysis,
          timestamp: new Date()
        };
        
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        setHasStartedAnalysis(true);

        // Save conversation to database
        if (dream?.id) {
          onUpdateConversation(dream.id, updatedMessages);
        }
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: `Failed to analyze dream: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
      // Remove the user message if analysis failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 glass-card border border-white/20">
        <div className="flex h-full">
          {/* Left Panel - Dream Content */}
          <div className="w-1/2 flex flex-col border-r border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold gradient-text">✨ Your Dream</h3>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {dream?.title && (
                  <div className="glass-pill p-4 bg-primary/10">
                    <h4 className="font-semibold text-lg text-foreground">{dream.title}</h4>
                  </div>
                )}
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground/80 leading-relaxed text-base">{dream?.content}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
          
          {/* Right Panel - Analysis */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold gradient-text">🧠 Dream Analysis</h3>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {isLoading && messages.length === 0 && (
                  <div className="glass-pill p-6 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground font-medium">Analyzing your dream...</span>
                      <p className="text-sm text-muted-foreground/60">Uncovering hidden meanings</p>
                    </div>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div key={message.id} className="space-y-4">
                    {message.role === 'assistant' ? (
                      <div className="glass-pill p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border-l-4 border-primary/50">
                        <h4 className="font-semibold text-primary mb-3">🔍 Symbolic Patterns</h4>
                        <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="glass-pill p-3 bg-white/5 ml-4">
                        <p className="text-foreground/70 text-sm">"{message.content}"</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && messages.length > 0 && (
                  <div className="glass-pill p-4 bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                )}
                
                {!hasStartedAnalysis && messages.length === 0 && !isLoading && (
                  <div className="glass-pill p-6 text-center">
                    <Button 
                      onClick={startInitialAnalysis}
                      disabled={isLoading}
                      className="glass-pill bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold px-8 py-3 shadow-premium"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Dream
                    </Button>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={messages.length === 0 ? "The analysis will start automatically..." : "Ask a follow-up question..."}
                  disabled={isLoading || (messages.length === 0 && !hasStartedAnalysis)}
                  className="flex-1 glass-pill bg-white/5 border-white/10"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || (messages.length === 0 && !hasStartedAnalysis)}
                  className="glass-pill"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
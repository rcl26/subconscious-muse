import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Moon, Bot, User, X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dream, Message } from "@/hooks/useDreams";
import { MobileDrawer } from "./MobileDrawer";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatContent = (
    <div 
      className="h-full flex flex-col relative"
      style={{
        background: `linear-gradient(rgba(37, 20, 61, 0.95), rgba(48, 25, 78, 0.98)), url('/cosmic-background-low.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/10 bg-background/10 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Dream Exploration</h2>
              <p className="text-sm text-muted-foreground">AI-powered dream analysis</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Dream Context */}
        {dream && (
          <div className="px-4 pb-4 max-w-4xl mx-auto">
            <div className="p-4 bg-muted/20 backdrop-blur-sm rounded-lg border border-border/20">
              <p className="text-sm text-muted-foreground mb-1">Your Dream:</p>
              <p className="text-sm text-foreground line-clamp-3">
                "{dream.content}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {isLoading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-fade-in">
                <div className="relative">
                  <Moon className="h-16 w-16 text-primary/30 animate-pulse" />
                  <Sparkles className="h-8 w-8 text-primary/50 absolute -top-2 -right-2 animate-spin" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-xl font-medium text-foreground">Exploring Your Dream</p>
                  <p className="text-muted-foreground">Analyzing patterns, symbols, and deeper meanings...</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex space-x-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/30 text-muted-foreground border border-border/20'
                  }`}>
                    {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/30 text-foreground border border-border/20 backdrop-blur-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-4 max-w-[85%]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/30 text-muted-foreground border border-border/20 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl px-6 py-4 bg-muted/30 border border-border/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-muted-foreground">Thinking deeply about your dream...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/10 bg-background/10 backdrop-blur-sm">
        <div className="p-4 max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={messages.length === 0 ? "The analysis will start automatically..." : "Ask a follow-up question about your dream..."}
              disabled={isLoading || (messages.length === 0 && !hasStartedAnalysis)}
              className="flex-1 min-h-[60px] max-h-32 resize-none bg-background/50 border-border/30 backdrop-blur-sm"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || (messages.length === 0 && !hasStartedAnalysis)}
              size="lg"
              className="self-end px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MobileDrawer
      open={isOpen}
      onOpenChange={onClose}
      title=""
      className="w-full h-full max-w-none md:w-[95vw] md:h-[95vh] md:max-w-none p-0 m-0"
    >
      {chatContent}
    </MobileDrawer>
  );
};
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Moon, Bot, User } from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { Dream } from "@/components/DreamEntry";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DreamConversationModalProps {
  dream: Dream | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DreamConversationModal = ({ dream, isOpen, onClose }: DreamConversationModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { analyzeDream } = useOpenAI();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-start analysis when modal opens with a dream
  useEffect(() => {
    if (dream && isOpen && !hasStartedAnalysis) {
      startInitialAnalysis();
      setHasStartedAnalysis(true);
    }
  }, [dream, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setHasStartedAnalysis(false);
      setInputValue("");
    }
  }, [isOpen]);

  const startInitialAnalysis = async () => {
    if (!dream) return;
    
    setIsLoading(true);
    try {
      const analysis = await analyzeDream(dream.text);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: analysis,
        timestamp: new Date()
      };
      
      setMessages([assistantMessage]);
    } catch (error) {
      console.error('Error analyzing dream:', error);
      toast({
        title: "Analysis Error",
        description: "Unable to analyze your dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !dream || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Create conversation context for follow-up questions
      const conversationContext = `Original dream: "${dream.text}"

Previous conversation:
${messages.map(m => `${m.role === 'user' ? 'Dreamer' : 'Dream Guide'}: ${m.content}`).join('\n\n')}

Dreamer: ${userMessage.content}

Please respond as the warm, empathetic dream guide. Continue the conversation naturally, addressing their question or comment about their dream. Keep the same supportive tone and provide thoughtful insights.`;

      const response = await analyzeDream(conversationContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in conversation:', error);
      toast({
        title: "Response Error",
        description: "Unable to continue the conversation. Please try again.",
        variant: "destructive",
      });
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
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5 text-primary" />
            <span>Dream Exploration</span>
          </DialogTitle>
          <DialogDescription className="text-left">
            {dream && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  "{dream.text}"
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {isLoading && messages.length === 0 && (
              <div className="flex items-center justify-center space-x-2 py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Exploring your dream...</span>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messages.length === 0 ? "The analysis will start automatically..." : "Ask a follow-up question about your dream..."}
              disabled={isLoading || (messages.length === 0 && !hasStartedAnalysis)}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || (messages.length === 0 && !hasStartedAnalysis)}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
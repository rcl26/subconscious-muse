import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    onApiKeySet(apiKey);
    toast({
      title: "API Key Saved",
      description: "You can now analyze your dreams with GPT!",
    });
  };

  return (
    <Card className="p-6 bg-card shadow-float border border-border/50">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Setup OpenAI API</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          To analyze your dreams with GPT, please enter your OpenAI API key. 
          Your key is stored locally and never sent to our servers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apikey">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apikey"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save API Key
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></p>
        </div>
      </div>
    </Card>
  );
};
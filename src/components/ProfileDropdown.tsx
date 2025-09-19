import { LogOut, Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileDropdownProps {
  onSubscriptionClick: () => void;
  onSignOut: () => void;
}

export const ProfileDropdown = ({ onSubscriptionClick, onSignOut }: ProfileDropdownProps) => {
  const { user, profile, hasActiveSubscription } = useAuth();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 bg-primary-foreground/10 px-3 py-2 rounded-lg hover:bg-primary-foreground/20 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary-foreground/30">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-medium">
            {getInitials(user.email || "")}
          </AvatarFallback>
        </Avatar>
        <span className="text-primary-foreground text-sm font-medium hidden sm:block">
          {user.email}
        </span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background/95 backdrop-blur-sm border-primary-foreground/10"
      >
        <DropdownMenuLabel className="text-foreground">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary-foreground/10" />
        
        <DropdownMenuItem 
          className="text-foreground/80 focus:bg-primary-foreground/10 focus:text-foreground cursor-default"
        >
          <div className="flex flex-col">
            <span className="text-xs text-foreground/60">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onSubscriptionClick}
          className="text-foreground/80 hover:bg-primary-foreground/10 focus:bg-primary-foreground/10 focus:text-foreground cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-3 text-blue-300" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {hasActiveSubscription ? 'Subscription' : 'Subscribe Now'}
            </span>
            <span className="text-xs text-foreground/60">
              {hasActiveSubscription 
                ? 'Manage your subscription' 
                : '$1/week for unlimited dreams'
              }
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-primary-foreground/10" />
        
        <DropdownMenuItem 
          onClick={onSignOut}
          className="text-foreground/80 hover:bg-primary-foreground/10 focus:bg-primary-foreground/10 focus:text-foreground cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
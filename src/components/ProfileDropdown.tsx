import { LogOut } from "lucide-react";
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
  onSignOut: () => void;
}

export const ProfileDropdown = ({ onSignOut }: ProfileDropdownProps) => {
  const { user, profile } = useAuth();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-full transition-all duration-300 cursor-pointer outline-none hover:scale-105 hover:shadow-glow">
        <Avatar className="h-8 w-8 border border-white/20">
          <AvatarFallback className="bg-card/80 text-card-foreground font-helvetica font-medium backdrop-blur-sm">
            {getInitials(user.email || "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-card/95 backdrop-blur-md border border-white/20 shadow-elegant rounded-xl font-helvetica"
      >
        <DropdownMenuLabel className="text-card-foreground font-medium py-3">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        <DropdownMenuItem 
          className="text-card-foreground/90 focus:bg-white/10 focus:text-card-foreground cursor-default py-3"
        >
          <div className="flex flex-col">
            <span className="text-xs text-card-foreground/60 font-medium">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/10" />
        
        <DropdownMenuItem 
          onClick={onSignOut}
          className="text-card-foreground/90 hover:bg-white/10 focus:bg-white/10 focus:text-card-foreground cursor-pointer py-3 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3 rotate-180" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
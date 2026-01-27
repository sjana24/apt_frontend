import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";

export function AdminTopBar() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('fullname');

  return (
    <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground p-2 bg-muted/50 rounded-lg" />
        <h2 className="text-lg font-bold tracking-tight hidden sm:block">Administrative Portal</h2>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative group flex items-center gap-3 h-auto py-1 px-2 hover:bg-muted/50 rounded-xl transition-all">
              <div className="flex flex-col items-end mr-2 hidden md:flex">
                <span className="text-sm font-bold leading-none">{currentUser}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Super Admin</span>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/20 transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {currentUser?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-bold text-xs uppercase text-muted-foreground tracking-widest px-4 py-3">
              Admin Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/profile" className="flex items-center gap-2 cursor-pointer w-full">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive flex items-center gap-2 cursor-pointer"
              onClick={() => {
                localStorage.clear();
                navigate('/signin');
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

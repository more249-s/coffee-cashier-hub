import { Coffee, LayoutDashboard, ShoppingCart, Wallet, Package, Settings, LogOut, User, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  { title: "لوحة التحكم", url: "/dashboard", icon: LayoutDashboard },
  { title: "المبيعات", url: "/sales", icon: ShoppingCart },
  { title: "المصروفات", url: "/expenses", icon: Wallet },
  { title: "المخزون", url: "/inventory", icon: Package },
  { title: "البروفايل", url: "/profile", icon: User },
  { title: "الإعدادات", url: "/settings", icon: Settings },
];

export function AppDrawer() {
  const { signOut, userRole } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover-scale">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-md">
              <Coffee className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <SheetTitle className="text-xl font-bold">كوفي شوب</SheetTitle>
              <span className="text-sm text-muted-foreground">
                {userRole === 'owner' ? 'المدير' : 'موظف'}
              </span>
            </div>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-2 rounded-lg p-4 transition-all hover-scale ${
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                    : "bg-card text-card-foreground hover:bg-accent/50 hover:text-accent-foreground"
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-sm text-center">{item.title}</span>
            </NavLink>
          ))}
        </div>

        <div className="border-t pt-4">
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full gap-3 hover-scale"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

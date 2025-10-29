import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  price?: string;
}

export function QuickActionButton({ label, icon: Icon, onClick, price }: QuickActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="h-24 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all"
    >
      <Icon className="h-6 w-6" />
      <span className="font-semibold">{label}</span>
      {price && <span className="text-xs text-muted-foreground">{price} جنيه</span>}
    </Button>
  );
}

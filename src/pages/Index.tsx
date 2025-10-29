import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl">
            <Coffee className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          مرحباً بك في نظام إدارة الكوفي شوب
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          نظام متكامل لإدارة المبيعات، المصروفات، والمخزون بسهولة وفعالية
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={() => navigate("/dashboard")}
          >
            الدخول إلى لوحة التحكم
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8"
            onClick={() => navigate("/sales")}
          >
            المبيعات السريعة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

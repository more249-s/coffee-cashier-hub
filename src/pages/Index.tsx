import { Coffee, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="max-w-2xl w-full space-y-8 text-center animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mb-6 animate-bounce-in shadow-warm">
            <Coffee className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">
            كوفي شوب
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            نظام إدارة احترافي لمحلات القهوة
          </p>
        </div>

        <div className="space-y-4 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-card border-2 border-border shadow-elegant hover:shadow-warm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">إدارة المبيعات</h3>
              <p className="text-muted-foreground">تتبع المبيعات اليومية بسهولة</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border shadow-elegant hover:shadow-warm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-bold mb-2">إدارة المخزون</h3>
              <p className="text-muted-foreground">راقب المخزون بذكاء</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border shadow-elegant hover:shadow-warm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">تقارير شاملة</h3>
              <p className="text-muted-foreground">تحليلات دقيقة للأداء</p>
            </div>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 gap-3 shadow-warm hover:shadow-glow transition-all"
            >
              <LogIn className="w-6 h-6" />
              ابدأ الآن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

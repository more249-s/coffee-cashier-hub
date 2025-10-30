import { useState, useEffect } from "react";
import { Zap, Wifi, Home, Fuel, Coffee, Package } from "lucide-react";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  created_at: string;
  employee_id: string;
  profiles: { full_name: string };
}

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    fetchExpenses();
    fetchTotals();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`*, profiles (full_name)`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في جلب المصروفات');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const { data: dailyData } = await supabase.from('expenses').select('amount').gte('created_at', today.toISOString());
      const daily = dailyData?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      setDailyTotal(daily);

      const { data: monthlyData } = await supabase.from('expenses').select('amount').gte('created_at', firstDayOfMonth.toISOString());
      const monthly = monthlyData?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      setMonthlyTotal(monthly);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickExpense = async (title: string, category: string, amount: number) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      const { error } = await supabase.from('expenses').insert({ title, category, amount, employee_id: user.id });
      if (error) throw error;

      toast.success(`تم إضافة ${title} بنجاح - ${amount} جنيه`);
      fetchExpenses();
      fetchTotals();
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في إضافة المصروف');
    }
  };

  const fixedExpenses = [
    { label: "كهرباء", icon: Zap, price: 500, category: "فواتير" },
    { label: "إنترنت", icon: Wifi, price: 250, category: "فواتير" },
    { label: "إيجار", icon: Home, price: 3000, category: "ثابت" },
  ];

  const quickSupplies = [
    { label: "بن", icon: Coffee, price: 150, category: "مواد خام" },
    { label: "حليب", icon: Package, price: 80, category: "مواد خام" },
    { label: "وقود", icon: Fuel, price: 200, category: "تشغيل" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">المصروفات</h1>
        <p className="text-muted-foreground">تتبع المصروفات اليومية والشهرية</p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader><CardTitle>المصروفات الشهرية الثابتة</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fixedExpenses.map((item) => (
              <QuickActionButton key={item.label} label={item.label} icon={item.icon} price={`${item.price}`} onClick={() => handleQuickExpense(item.label, item.category, item.price)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader><CardTitle>مستلزمات سريعة</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickSupplies.map((item) => (
              <QuickActionButton key={item.label} label={item.label} icon={item.icon} price={`${item.price}`} onClick={() => handleQuickExpense(item.label, item.category, item.price)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-destructive/10 to-warning/10 border-destructive/20 shadow-warm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">إجمالي مصروفات اليوم</p>
              <p className="text-4xl font-bold text-destructive">{dailyTotal.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-accent/10 border-warning/20 shadow-warm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">إجمالي مصروفات الشهر</p>
              <p className="text-4xl font-bold text-warning">{monthlyTotal.toFixed(2)} جنيه</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader><CardTitle>آخر المصروفات</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">جاري التحميل...</p> : expenses.length === 0 ? <p className="text-center text-muted-foreground py-8">لا توجد مصروفات بعد</p> : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all hover-scale">
                  <div className="flex-1">
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">التصنيف: {expense.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">المسؤول: {expense.profiles.full_name} • {new Date(expense.created_at).toLocaleString('ar-EG')}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-destructive">{expense.amount} جنيه</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

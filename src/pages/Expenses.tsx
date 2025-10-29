import { Plus, Zap, Home, Coffee, Users, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickActionButton } from "@/components/QuickActionButton";
import { toast } from "sonner";

export default function Expenses() {
  const handleQuickExpense = (item: string, price: number) => {
    toast.success(`تم إضافة ${item} للمصروفات`, {
      description: `المبلغ: ${price} جنيه`,
    });
  };

  const fixedExpenses = [
    { label: "الإيجار", icon: Home, price: 3000 },
    { label: "الكهرباء", icon: Zap, price: 500 },
    { label: "الرواتب", icon: Users, price: 4000 },
    { label: "الصيانة", icon: Wrench, price: 200 },
  ];

  const quickSupplies = [
    { label: "بن", icon: Coffee, price: 150 },
    { label: "سكر", icon: Coffee, price: 50 },
    { label: "حليب", icon: Coffee, price: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">المصروفات</h1>
          <p className="text-muted-foreground">تتبع جميع مصروفات المحل</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          إضافة مصروف
        </Button>
      </div>

      {/* Fixed Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>المصروفات الثابتة الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fixedExpenses.map((expense) => (
              <QuickActionButton
                key={expense.label}
                label={expense.label}
                icon={expense.icon}
                price={expense.price.toString()}
                onClick={() => handleQuickExpense(expense.label, expense.price)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Supplies */}
      <Card>
        <CardHeader>
          <CardTitle>المستلزمات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickSupplies.map((supply) => (
              <QuickActionButton
                key={supply.label}
                label={supply.label}
                icon={supply.icon}
                price={supply.price.toString()}
                onClick={() => handleQuickExpense(supply.label, supply.price)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>المصروفات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "اليوم 14:00", item: "بن - شراء مستلزمات", amount: 150, category: "مستلزمات" },
              { time: "اليوم 10:30", item: "صيانة ماكينة القهوة", amount: 200, category: "صيانة" },
              { time: "أمس", item: "فاتورة الكهرباء", amount: 500, category: "فواتير" },
              { time: "منذ 3 أيام", item: "حليب - شراء بالجملة", amount: 300, category: "مستلزمات" },
            ].map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <p className="font-medium">{expense.item}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {expense.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{expense.time}</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-destructive">-{expense.amount} جنيه</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">إجمالي اليوم</p>
              <p className="text-3xl font-bold text-destructive">850 جنيه</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">إجمالي الشهر</p>
              <p className="text-3xl font-bold text-destructive">12,450 جنيه</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">المتبقي للميزانية</p>
              <p className="text-3xl font-bold text-warning">2,550 جنيه</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

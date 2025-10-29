import { Coffee, IceCream, Cookie, Sandwich, Plus } from "lucide-react";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Sales() {
  const handleQuickSale = (item: string, price: number) => {
    toast.success(`تم إضافة ${item} بنجاح`, {
      description: `السعر: ${price} جنيه`,
    });
  };

  const quickItems = [
    { label: "قهوة تركي", icon: Coffee, price: 15 },
    { label: "شاي بالنعناع", icon: Coffee, price: 10 },
    { label: "كابتشينو", icon: Coffee, price: 25 },
    { label: "لاتيه", icon: Coffee, price: 30 },
    { label: "آيس كريم", icon: IceCream, price: 20 },
    { label: "كوكيز", icon: Cookie, price: 12 },
    { label: "ساندوتش", icon: Sandwich, price: 35 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">المبيعات اليومية</h1>
          <p className="text-muted-foreground">إضافة وإدارة المبيعات بسرعة</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          إضافة مبيع يدوي
        </Button>
      </div>

      {/* Quick Sale Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickItems.map((item) => (
              <QuickActionButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                price={item.price.toString()}
                onClick={() => handleQuickSale(item.label, item.price)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>المبيعات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "14:30", item: "قهوة تركي × 2", amount: 30 },
              { time: "14:25", item: "كابتشينو × 1", amount: 25 },
              { time: "14:20", item: "شاي بالنعناع × 3", amount: 30 },
              { time: "14:15", item: "ساندوتش × 1, لاتيه × 1", amount: 65 },
              { time: "14:10", item: "آيس كريم × 2", amount: 40 },
            ].map((sale, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{sale.item}</p>
                  <p className="text-sm text-muted-foreground">{sale.time}</p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-success">{sale.amount} جنيه</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">إجمالي المبيعات</p>
              <p className="text-3xl font-bold">2,450 جنيه</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">عدد العمليات</p>
              <p className="text-3xl font-bold">87</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">متوسط البيع</p>
              <p className="text-3xl font-bold">28 جنيه</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

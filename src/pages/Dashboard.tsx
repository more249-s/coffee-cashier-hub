import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Wallet, Package } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة شاملة على أداء المحل</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المبيعات اليوم"
          value="2,450 جنيه"
          icon={ShoppingCart}
          trend="+12.5% من أمس"
          trendUp={true}
        />
        <StatCard
          title="إجمالي المصروفات اليوم"
          value="850 جنيه"
          icon={Wallet}
          trend="-5.2% من أمس"
          trendUp={false}
        />
        <StatCard
          title="صافي الربح اليومي"
          value="1,600 جنيه"
          icon={DollarSign}
          trend="+18.3%"
          trendUp={true}
        />
        <StatCard
          title="المنتجات المنخفضة"
          value="5 منتجات"
          icon={Package}
          className="border-warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              الأرباح الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">الرسم البياني سيظهر هنا</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              أكثر المنتجات مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "قهوة تركي", sales: 145, percentage: 35 },
                { name: "شاي بالنعناع", sales: 120, percentage: 29 },
                { name: "كابتشينو", sales: 95, percentage: 23 },
                { name: "لاتيه", sales: 54, percentage: 13 },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.sales} كوب</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">متوسط الربح اليومي</p>
              <p className="text-2xl font-bold">1,750 جنيه</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">عدد المبيعات اليوم</p>
              <p className="text-2xl font-bold">87 عملية</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">متوسط قيمة البيع</p>
              <p className="text-2xl font-bold">28 جنيه</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
